
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface JobScrapeRequest {
  websites: string[];
  searchTerms?: string[];
}

interface ScrapedJob {
  title: string;
  project_name?: string;
  description?: string;
  location?: string;
  compensation_range?: string;
  role_type: string;
  application_deadline?: string;
  external_url: string;
  source_platform: string;
  casting_director?: string;
  requirements?: string;
  genres?: string[];
  age_range?: string;
  gender_requirements?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websites, searchTerms = [] }: JobScrapeRequest = await req.json();
    const browserlessApiKey = Deno.env.get('BROWSERLESS_API_KEY');

    console.log('🚀 PUPPETEER: Starting enhanced job scraping');
    console.log('🔧 Available APIs:', { browserless: !!browserlessApiKey });
    console.log('🌐 Target websites:', websites);

    if (!browserlessApiKey) {
      throw new Error('BROWSERLESS_API_KEY is required for Puppeteer scraping');
    }

    const scrapedJobs: ScrapedJob[] = [];

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test database connectivity
    console.log('🔍 PUPPETEER: Testing database connectivity...');
    const { data: testData, error: testError } = await supabase
      .from('casting_opportunities')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ PUPPETEER: Database connection failed:', testError);
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    console.log('✅ PUPPETEER: Database connected successfully');

    // Updated website configurations with better selectors
    const websiteConfigs = [
      {
        url: "https://www.backstage.com/casting/",
        platform: "backstage.com",
        selectors: {
          jobCards: 'a[href*="/casting/"]',
          title: 'h3, .title, [data-testid*="title"]',
          description: '.description, p',
          location: '.location, [class*="location"]',
          compensation: '.rate, .pay, [class*="rate"]'
        },
        waitTime: 3000
      },
      {
        url: "https://www.castingnetworks.com/auditions",
        platform: "castingnetworks.com", 
        selectors: {
          jobCards: 'a[href*="audition"], a[href*="casting"], a[href*="role"]',
          title: 'h3, .title, strong',
          description: '.description, p',
          location: '.location',
          compensation: '.rate, .pay'
        },
        waitTime: 5000
      },
      {
        url: "https://www.spotlight.com/actors/auditions",
        platform: "spotlight.com",
        selectors: {
          jobCards: 'a[href*="audition"], .job-card, .casting-card',
          title: 'h3, .title, .job-title',
          description: '.description, p',
          location: '.location',
          compensation: '.fee, .rate'
        },
        waitTime: 4000,
        requiresAuth: true
      }
    ];

    const targetConfigs = websites?.length ? 
      websiteConfigs.filter(config => websites.includes(config.url)) : 
      websiteConfigs;

    for (const config of targetConfigs) {
      try {
        console.log(`\n🌐 PUPPETEER: Processing website: ${config.url}`);
        
        const extractedJobs = await scrapeWithPuppeteer(config, browserlessApiKey);
        console.log(`🎭 PUPPETEER: Extracted ${extractedJobs.length} jobs from ${config.platform}`);
        
        // Validate and filter jobs
        const validJobs = extractedJobs.filter((job, index) => {
          const validation = validateJobData(job);
          if (!validation.isValid) {
            console.log(`❌ PUPPETEER: Job ${index + 1} invalid: ${validation.reason}`);
            return false;
          }
          return true;
        });

        scrapedJobs.push(...validJobs);
        console.log(`✅ PUPPETEER: Valid jobs from ${config.url}: ${validJobs.length}`);

      } catch (error) {
        console.error(`❌ PUPPETEER: Error scraping ${config.url}:`, error.message);
      }
    }

    console.log(`\n📊 PUPPETEER SUMMARY: Total valid jobs found: ${scrapedJobs.length}`);

    if (scrapedJobs.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No valid jobs found during Puppeteer scraping - websites may require authentication or have updated their structure",
          totalFound: 0,
          newJobs: 0,
          duplicates: 0,
          rejected: 0,
          method: 'puppeteer'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Save jobs to database
    let savedCount = 0;
    let duplicateCount = 0;
    let rejectedCount = 0;
    
    for (const [index, job] of scrapedJobs.entries()) {
      try {
        console.log(`\n🔍 PUPPETEER: Processing job ${index + 1}/${scrapedJobs.length}: "${job.title}"`);
        
        // Check for duplicates
        const cleanTitle = job.title.replace(/[%_'"]/g, '').substring(0, 50);
        
        const { data: existing, error: searchError } = await supabase
          .from('casting_opportunities')
          .select('id, title, source_platform')
          .eq('source_platform', job.source_platform)
          .ilike('title', `%${cleanTitle}%`)
          .limit(5);

        if (searchError) {
          console.error('❌ PUPPETEER: Error checking duplicates:', searchError);
        }

        let isDuplicate = false;
        if (existing && existing.length > 0) {
          for (const existingJob of existing) {
            const similarity = calculateTitleSimilarity(job.title, existingJob.title);
            if (similarity > 0.85) {
              console.log(`🔄 PUPPETEER: DUPLICATE (${Math.round(similarity * 100)}%) - "${existingJob.title}"`);
              isDuplicate = true;
              break;
            }
          }
        }

        if (isDuplicate) {
          duplicateCount++;
          continue;
        }

        console.log('💾 PUPPETEER: Inserting new job...');
        const insertData = {
          title: job.title,
          project_name: job.project_name,
          description: job.description,
          location: job.location,
          compensation_range: job.compensation_range,
          role_type: job.role_type as any,
          application_deadline: job.application_deadline,
          external_url: job.external_url,
          source_platform: job.source_platform,
          casting_director: job.casting_director,
          requirements: job.requirements,
          genres: job.genres,
          age_range: job.age_range,
          gender_requirements: job.gender_requirements,
          status: 'active'
        };

        const { data: insertResult, error: insertError } = await supabase
          .from('casting_opportunities')
          .insert(insertData)
          .select('id, title');

        if (insertError) {
          console.error(`❌ PUPPETEER: DB Insert Error:`, insertError);
          rejectedCount++;
        } else {
          savedCount++;
          console.log(`✅ PUPPETEER: SAVED with ID: ${insertResult?.[0]?.id}`);
        }
      } catch (error) {
        console.error(`❌ PUPPETEER: Error processing job ${index + 1}:`, error.message);
        rejectedCount++;
      }
    }

    console.log(`\n📊 PUPPETEER FINAL RESULTS:`);
    console.log(`✅ Successfully saved: ${savedCount} jobs`);
    console.log(`🔄 Duplicates found: ${duplicateCount} jobs`);
    console.log(`❌ Rejected/Failed: ${rejectedCount} jobs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Puppeteer scraper saved ${savedCount} new jobs from ${targetConfigs.length} websites`,
        totalFound: scrapedJobs.length,
        newJobs: savedCount,
        duplicates: duplicateCount,
        rejected: rejectedCount,
        method: 'puppeteer'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ PUPPETEER: Critical error:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        method: 'puppeteer'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function scrapeWithPuppeteer(config: any, browserlessApiKey: string): Promise<ScrapedJob[]> {
  try {
    console.log(`🎭 PUPPETEER: Launching browser for ${config.platform}`);
    
    // Enhanced Puppeteer script with better job extraction
    const puppeteerScript = `
      const puppeteer = require('puppeteer');
      
      (async () => {
        const browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor'
          ]
        });
        
        try {
          const page = await browser.newPage();
          
          // Set realistic headers and viewport
          await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          await page.setViewport({ width: 1920, height: 1080 });
          
          // Set extra headers
          await page.setExtraHTTPHeaders({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          });
          
          console.log('🌐 Navigating to: ${config.url}');
          await page.goto('${config.url}', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
          });
          
          // Wait for page to load
          await page.waitForTimeout(${config.waitTime || 5000});
          
          // Try multiple strategies to find jobs
          const jobs = await page.evaluate(() => {
            const extractedJobs = [];
            
            // Strategy 1: Look for common casting job patterns
            const jobLinks = Array.from(document.querySelectorAll('a[href*="casting"], a[href*="audition"], a[href*="role"]'));
            console.log('Found job links:', jobLinks.length);
            
            jobLinks.forEach((link, index) => {
              try {
                if (index >= 50) return; // Limit to prevent too many results
                
                const href = link.href;
                const titleElement = link.querySelector('h1, h2, h3, h4, .title, [class*="title"]') || link;
                const title = titleElement.textContent?.trim();
                
                if (title && title.length > 3 && href && href.includes('http')) {
                  // Look for additional info near the link
                  const parent = link.closest('div, article, section, li') || link.parentElement;
                  const description = parent?.querySelector('p, .description, [class*="desc"]')?.textContent?.trim() || '';
                  const location = parent?.querySelector('.location, [class*="location"]')?.textContent?.trim() || '';
                  const compensation = parent?.querySelector('.rate, .pay, [class*="pay"], [class*="rate"]')?.textContent?.trim() || '';
                  
                  extractedJobs.push({
                    title: title,
                    external_url: href,
                    description: description,
                    location: location,
                    compensation_range: compensation,
                    project_name: title,
                    role_type: 'background',
                    source_platform: '${config.platform}',
                    requirements: '',
                    genres: [],
                    age_range: '',
                    gender_requirements: ''
                  });
                }
              } catch (e) {
                console.log('Error processing job link:', e);
              }
            });
            
            // Strategy 2: Look for text patterns that indicate casting calls
            if (extractedJobs.length === 0) {
              const textNodes = Array.from(document.querySelectorAll('*')).filter(el => 
                el.textContent && (
                  el.textContent.toLowerCase().includes('casting') ||
                  el.textContent.toLowerCase().includes('audition') ||
                  el.textContent.toLowerCase().includes('role') ||
                  el.textContent.toLowerCase().includes('actor')
                )
              );
              
              console.log('Found text nodes with casting keywords:', textNodes.length);
              
              textNodes.slice(0, 20).forEach(node => {
                try {
                  const text = node.textContent?.trim();
                  const link = node.closest('a') || node.querySelector('a');
                  
                  if (text && text.length > 10 && text.length < 200 && link?.href) {
                    extractedJobs.push({
                      title: text.substring(0, 100),
                      external_url: link.href,
                      description: text,
                      location: '',
                      compensation_range: '',
                      project_name: text.substring(0, 100),
                      role_type: 'background',
                      source_platform: '${config.platform}',
                      requirements: '',
                      genres: [],
                      age_range: '',
                      gender_requirements: ''
                    });
                  }
                } catch (e) {
                  console.log('Error processing text node:', e);
                }
              });
            }
            
            console.log('Total jobs extracted:', extractedJobs.length);
            return extractedJobs;
          });
          
          console.log('📊 Extracted jobs:', jobs.length);
          return jobs;
          
        } finally {
          await browser.close();
        }
      })();
    `;

    // Send request to Browserless
    const response = await fetch(`https://chrome.browserless.io/function?token=${browserlessApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: puppeteerScript,
        context: {}
      }),
    });

    console.log(`🎭 PUPPETEER: Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🎭 PUPPETEER: Failed for ${config.url}:`, errorText);
      return [];
    }

    const result = await response.json();
    console.log(`🎭 PUPPETEER: Raw result keys:`, Object.keys(result));

    // Handle the response format from Browserless
    const jobs = Array.isArray(result) ? result : (result.data || []);
    
    // Process and validate jobs
    const processedJobs = jobs.map((job: any) => ({
      ...job,
      role_type: determineRoleType(job.title, job.description),
      genres: extractGenres(job.description || ''),
      age_range: extractAgeRange(job.description || ''),
      gender_requirements: extractGender(job.description || '')
    }));

    console.log(`🎭 PUPPETEER: Processed ${processedJobs.length} jobs from ${config.platform}`);
    return processedJobs;

  } catch (error) {
    console.error(`❌ PUPPETEER: Error for ${config.url}:`, error.message);
    return [];
  }
}

function calculateTitleSimilarity(title1: string, title2: string): number {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const norm1 = normalize(title1);
  const norm2 = normalize(title2);
  
  if (norm1 === norm2) return 1.0;
  if (norm1.length === 0 || norm2.length === 0) return 0;
  
  const words1 = new Set(norm1.split(/\s+/));
  const words2 = new Set(norm2.split(/\s+/));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

function validateJobData(job: ScrapedJob): { isValid: boolean; reason?: string } {
  if (!job.title || job.title.trim().length === 0) {
    return { isValid: false, reason: 'Missing or empty title' };
  }
  
  if (job.title.length < 3) {
    return { isValid: false, reason: `Title too short: "${job.title}"` };
  }
  
  if (!job.external_url) {
    return { isValid: false, reason: 'Missing external URL' };
  }
  
  // Filter out obviously bad titles
  const badPatterns = [
    /^(sign in|login|register|home|about|contact|privacy|terms)$/i,
    /^[^a-zA-Z]*$/,
    /^\d+$/
  ];
  
  for (const pattern of badPatterns) {
    if (pattern.test(job.title)) {
      return { isValid: false, reason: `Title appears to be navigation/junk: "${job.title}"` };
    }
  }
  
  return { isValid: true };
}

function determineRoleType(title: string, description: string): string {
  const content = (title + ' ' + description).toLowerCase();
  if (content.includes('lead') || content.includes('principal') || content.includes('main')) return 'lead';
  if (content.includes('supporting') || content.includes('featured')) return 'supporting';
  return 'background';
}

function extractGenres(content: string): string[] {
  const genres: string[] = [];
  const genrePatterns = ['drama', 'comedy', 'thriller', 'horror', 'action', 'romance', 'sci-fi', 'documentary'];
  for (const genre of genrePatterns) {
    if (new RegExp(genre, 'i').test(content)) {
      genres.push(genre);
    }
  }
  return genres;
}

function extractAgeRange(content: string): string {
  const ageMatch = content.match(/age[s]?[\s:]*([0-9\s\-to]{3,15})/i);
  return ageMatch?.[1]?.trim() || '';
}

function extractGender(content: string): string {
  const genderMatch = content.match(/(male|female|non-binary|any gender)/i);
  return genderMatch?.[1] || '';
}
