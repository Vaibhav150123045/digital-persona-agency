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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websites, searchTerms = [] }: JobScrapeRequest = await req.json();
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    const browserlessApiKey = Deno.env.get('BROWSERLESS_API_KEY');

    console.log('🚀 Starting job scraping for websites:', websites);
    console.log('🔍 Search terms:', searchTerms);

    const scrapedJobs: ScrapedJob[] = [];

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    for (const website of websites) {
      try {
        console.log(`\n🌐 Processing website: ${website}`);
        
        // Determine scraping method based on website
        let extractedJobs: ScrapedJob[] = [];
        
        if (shouldUseBrowserless(website) && browserlessApiKey) {
          console.log(`🤖 Using Browserless for ${website}`);
          extractedJobs = await scrapeWithBrowserless(website, browserlessApiKey);
        } else if (firecrawlApiKey) {
          console.log(`🔥 Using Firecrawl for ${website}`);
          extractedJobs = await scrapeWithFirecrawl(website, firecrawlApiKey);
        } else {
          console.log('❌ No scraping API keys available');
          continue;
        }

        scrapedJobs.push(...extractedJobs);
        console.log(`✅ Extracted ${extractedJobs.length} valid jobs from ${website}`);

      } catch (error) {
        console.error(`❌ Error scraping ${website}:`, error);
      }
    }

    console.log(`\n📊 SCRAPING SUMMARY:`);
    console.log(`📈 Total jobs extracted: ${scrapedJobs.length}`);

    // Save jobs to database with better validation logging
    let savedCount = 0;
    let duplicateCount = 0;
    let rejectedCount = 0;
    
    for (const [index, job] of scrapedJobs.entries()) {
      try {
        console.log(`\n🔍 Processing job ${index + 1}/${scrapedJobs.length}:`);
        console.log(`📝 Title: "${job.title}"`);
        console.log(`🔗 URL: ${job.external_url}`);
        
        // Validate job data with detailed logging
        const validationResult = validateJobData(job);
        if (!validationResult.isValid) {
          console.log(`❌ REJECTED: ${validationResult.reason}`);
          rejectedCount++;
          continue;
        }

        // Check if job already exists by external_url or title
        const { data: existing } = await supabase
          .from('casting_opportunities')
          .select('id')
          .or(`external_url.eq.${job.external_url},title.eq.${job.title}`)
          .maybeSingle();

        if (!existing) {
          const { error } = await supabase
            .from('casting_opportunities')
            .insert({
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
            });

          if (!error) {
            savedCount++;
            console.log(`✅ SAVED: "${job.title}"`);
          } else {
            console.error(`❌ DB Error saving job:`, error);
            rejectedCount++;
          }
        } else {
          duplicateCount++;
          console.log(`🔄 DUPLICATE: Job already exists`);
        }
      } catch (error) {
        console.error(`❌ Error processing job:`, error);
        rejectedCount++;
      }
    }

    console.log(`\n📊 FINAL RESULTS:`);
    console.log(`✅ Successfully saved: ${savedCount} jobs`);
    console.log(`🔄 Duplicates found: ${duplicateCount} jobs`);
    console.log(`❌ Rejected/Failed: ${rejectedCount} jobs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully scraped and saved ${savedCount} new jobs from ${websites.length} websites`,
        totalFound: scrapedJobs.length,
        newJobs: savedCount,
        duplicates: duplicateCount,
        rejected: rejectedCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Critical error in scrape-acting-jobs function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function validateJobData(job: ScrapedJob): { isValid: boolean; reason?: string } {
  if (!job.title) {
    return { isValid: false, reason: 'Missing title' };
  }
  
  if (job.title.length < 10) {
    return { isValid: false, reason: `Title too short (${job.title.length} chars): "${job.title}"` };
  }
  
  if (!job.external_url) {
    return { isValid: false, reason: 'Missing external URL' };
  }
  
  if (isJunkTitle(job.title)) {
    return { isValid: false, reason: `Title appears to be junk: "${job.title}"` };
  }
  
  return { isValid: true };
}

function shouldUseBrowserless(website: string): boolean {
  // Use Browserless for sites that typically require authentication or complex interactions
  const browserlessSites = [
    'spotlight.com',
    'castingnetworks.com',
    'actorsaccess.com',
    'breakdown.com'
  ];
  
  return browserlessSites.some(site => website.includes(site));
}

async function scrapeWithBrowserless(website: string, apiKey: string): Promise<ScrapedJob[]> {
  try {
    console.log(`🤖 Sending request to Browserless for ${website}`);
    
    // Create Puppeteer script for headless browsing
    const puppeteerScript = createPuppeteerScript(website);
    
    const response = await fetch(`https://chrome.browserless.io/function?token=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: puppeteerScript,
        context: { website }
      }),
    });

    if (!response.ok) {
      throw new Error(`Browserless API error: ${response.status}`);
    }

    const result = await response.json();
    console.log(`🤖 Browserless raw result:`, result);

    if (result.data && Array.isArray(result.data)) {
      console.log(`🤖 Browserless found ${result.data.length} potential jobs`);
      return result.data.map((job: any) => ({
        ...job,
        source_platform: getDomainName(website)
      }));
    }

    console.log(`🤖 Browserless returned no valid data`);
    return [];
  } catch (error) {
    console.error(`❌ Browserless error for ${website}:`, error);
    return [];
  }
}

function createPuppeteerScript(website: string): string {
  if (website.includes('spotlight.com')) {
    return createSpotlightScript();
  } else if (website.includes('castingnetworks.com')) {
    return createCastingNetworksScript();
  } else if (website.includes('actorsaccess.com')) {
    return createActorsAccessScript();
  } else {
    return createGenericScript();
  }
}

function createSpotlightScript(): string {
  return `
    module.exports = async (context) => {
      const { website } = context;
      const jobs = [];
      
      try {
        console.log('🎬 Navigating to Spotlight...');
        await page.goto(website, { waitUntil: 'networkidle2' });
        
        // Wait for casting listings to load
        console.log('⏳ Waiting for casting listings...');
        await page.waitForSelector('.job-item, .casting-item, .role-item', { timeout: 10000 });
        
        // Extract job listings
        const jobElements = await page.$$('.job-item, .casting-item, .role-item');
        console.log(\`🎭 Found \${jobElements.length} job elements\`);
        
        for (const [index, element] of jobElements.entries()) {
          try {
            console.log(\`🔍 Processing element \${index + 1}\`);
            const title = await element.$eval('h2, h3, .title', el => el.textContent?.trim()).catch(() => '');
            const description = await element.$eval('.description, .summary', el => el.textContent?.trim()).catch(() => '');
            const location = await element.$eval('.location', el => el.textContent?.trim()).catch(() => '');
            const deadline = await element.$eval('.deadline, .closes', el => el.textContent?.trim()).catch(() => '');
            const roleType = await element.$eval('.role-type', el => el.textContent?.trim()).catch(() => 'background');
            const projectName = await element.$eval('.project, .production', el => el.textContent?.trim()).catch(() => '');
            
            console.log(\`📝 Extracted: "\${title}" - \${title.length} chars\`);
            
            if (title && title.length > 10) {
              jobs.push({
                title: title,
                project_name: projectName,
                description: description,
                location: location,
                role_type: determineRoleType(roleType, title + ' ' + description),
                application_deadline: deadline,
                external_url: website,
                casting_director: '',
                requirements: description?.slice(0, 200),
                genres: extractGenres(title + ' ' + description),
                age_range: extractAgeRange(description || ''),
                gender_requirements: extractGender(description || '')
              });
              console.log(\`✅ Added job: "\${title}"\`);
            } else {
              console.log(\`❌ Rejected: title too short or missing\`);
            }
          } catch (err) {
            console.log('❌ Error extracting job element:', err);
          }
        }
        
      } catch (error) {
        console.error('❌ Error scraping Spotlight:', error);
      }
      
      console.log(\`🎬 Spotlight final count: \${jobs.length} jobs\`);
      return { data: jobs };
    };
    
    function determineRoleType(roleText, content) {
      const text = (roleText + ' ' + content).toLowerCase();
      if (text.includes('lead') || text.includes('principal') || text.includes('main')) return 'lead';
      if (text.includes('supporting') || text.includes('featured')) return 'supporting';
      return 'background';
    }
    
    function extractGenres(text) {
      const genres = [];
      const genrePatterns = ['drama', 'comedy', 'thriller', 'horror', 'action', 'romance', 'sci-fi'];
      for (const genre of genrePatterns) {
        if (text.toLowerCase().includes(genre)) genres.push(genre);
      }
      return genres;
    }
    
    function extractAgeRange(text) {
      const ageMatch = text.match(/age[s]?[:\s]*([0-9\s\-to]{3,15})/i);
      return ageMatch ? ageMatch[1].trim() : '';
    }
    
    function extractGender(text) {
      const genderMatch = text.match(/(male|female|non-binary|any gender)/i);
      return genderMatch ? genderMatch[1] : '';
    }
  `;
}

function createCastingNetworksScript(): string {
  return `
    module.exports = async (context) => {
      const { website } = context;
      const jobs = [];
      
      try {
        console.log('🎭 Navigating to Casting Networks...');
        await page.goto(website, { waitUntil: 'networkidle2' });
        
        // Wait for job listings
        console.log('⏳ Waiting for job listings...');
        await page.waitForSelector('.project-row, .casting-row, .breakdown-row', { timeout: 10000 });
        
        const jobElements = await page.$$('.project-row, .casting-row, .breakdown-row');
        console.log(\`🎬 Found \${jobElements.length} job elements\`);
        
        for (const [index, element] of jobElements.entries()) {
          try {
            console.log(\`🔍 Processing CN element \${index + 1}\`);
            const title = await element.$eval('.project-title, .breakdown-title', el => el.textContent?.trim()).catch(() => '');
            const description = await element.$eval('.project-description, .breakdown-description', el => el.textContent?.trim()).catch(() => '');
            const location = await element.$eval('.location', el => el.textContent?.trim()).catch(() => '');
            const compensation = await element.$eval('.rate, .pay', el => el.textContent?.trim()).catch(() => '');
            
            console.log(\`📝 CN Extracted: "\${title}" - \${title.length} chars\`);
            
            if (title && title.length > 10) {
              jobs.push({
                title: title,
                description: description,
                location: location,
                compensation_range: compensation,
                role_type: 'background',
                external_url: website,
                casting_director: '',
                requirements: description?.slice(0, 200)
              });
              console.log(\`✅ CN Added job: "\${title}"\`);
            } else {
              console.log(\`❌ CN Rejected: title too short or missing\`);
            }
          } catch (err) {
            console.log('❌ Error extracting CN job:', err);
          }
        }
        
      } catch (error) {
        console.error('❌ Error scraping Casting Networks:', error);
      }
      
      console.log(\`🎭 Casting Networks final count: \${jobs.length} jobs\`);
      return { data: jobs };
    };
  `;
}

function createActorsAccessScript(): string {
  return `
    module.exports = async (context) => {
      const { website } = context;
      const jobs = [];
      
      try {
        console.log('🎪 Navigating to Actors Access...');
        await page.goto(website, { waitUntil: 'networkidle2' });
        
        console.log('⏳ Waiting for breakdowns...');
        await page.waitForSelector('.breakdown, .project', { timeout: 10000 });
        
        const jobElements = await page.$$('.breakdown, .project');
        console.log(\`🎬 Found \${jobElements.length} breakdown elements\`);
        
        for (const [index, element] of jobElements.entries()) {
          try {
            console.log(\`🔍 Processing AA element \${index + 1}\`);
            const title = await element.$eval('.breakdown-title, .project-title', el => el.textContent?.trim()).catch(() => '');
            const description = await element.$eval('.breakdown-description', el => el.textContent?.trim()).catch(() => '');
            
            console.log(\`📝 AA Extracted: "\${title}" - \${title.length} chars\`);
            
            if (title && title.length > 10) {
              jobs.push({
                title: title,
                description: description,
                role_type: 'background',
                external_url: website,
                casting_director: '',
                requirements: description?.slice(0, 200)
              });
              console.log(\`✅ AA Added job: "\${title}"\`);
            } else {
              console.log(\`❌ AA Rejected: title too short or missing\`);
            }
          } catch (err) {
            console.log('❌ Error extracting AA job:', err);
          }
        }
        
      } catch (error) {
        console.error('❌ Error scraping Actors Access:', error);
      }
      
      console.log(\`🎪 Actors Access final count: \${jobs.length} jobs\`);
      return { data: jobs };
    };
  `;
}

function createGenericScript(): string {
  return `
    module.exports = async (context) => {
      const { website } = context;
      const jobs = [];
      
      try {
        console.log('🌐 Navigating to generic site...');
        await page.goto(website, { waitUntil: 'networkidle2' });
        
        // Try multiple selectors for job listings
        const selectors = [
          'div[class*="job"]',
          'div[class*="casting"]',
          'div[class*="role"]',
          'div[class*="opportunity"]',
          '.listing',
          '.item'
        ];
        
        let jobElements = [];
        for (const selector of selectors) {
          try {
            console.log(\`🔍 Trying selector: \${selector}\`);
            await page.waitForSelector(selector, { timeout: 3000 });
            jobElements = await page.$$(selector);
            console.log(\`📋 Found \${jobElements.length} elements with \${selector}\`);
            if (jobElements.length > 0) break;
          } catch (e) {
            console.log(\`❌ Selector \${selector} not found\`);
            continue;
          }
        }
        
        console.log(\`🎬 Processing \${Math.min(jobElements.length, 20)} elements\`);
        
        for (const [index, element] of jobElements.slice(0, 20).entries()) {
          try {
            console.log(\`🔍 Processing generic element \${index + 1}\`);
            const text = await element.evaluate(el => el.textContent);
            if (text && text.length > 50 && (text.includes('casting') || text.includes('role') || text.includes('audition'))) {
              const lines = text.split('\\n').filter(line => line.trim().length > 10);
              if (lines.length > 0) {
                const title = lines[0].trim();
                console.log(\`📝 Generic extracted: "\${title}" - \${title.length} chars\`);
                
                jobs.push({
                  title: title,
                  description: text.slice(0, 300),
                  role_type: 'background',
                  external_url: website,
                  casting_director: '',
                  requirements: ''
                });
                console.log(\`✅ Generic added job: "\${title}"\`);
              }
            } else {
              console.log(\`❌ Generic rejected: doesn't match casting criteria\`);
            }
          } catch (err) {
            console.log('❌ Error extracting generic job:', err);
          }
        }
        
      } catch (error) {
        console.error('❌ Error with generic scraping:', error);
      }
      
      console.log(\`🌐 Generic scraping final count: \${jobs.length} jobs\`);
      return { data: jobs };
    };
  `;
}

async function scrapeWithFirecrawl(website: string, apiKey: string): Promise<ScrapedJob[]> {
  try {
    console.log(`🔥 Sending request to Firecrawl for ${website}`);
    
    const crawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: website,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: false,
        }
      }),
    });

    if (!crawlResponse.ok) {
      const errorText = await crawlResponse.text();
      console.error(`🔥 Firecrawl failed for ${website}:`, errorText);
      return [];
    }

    const scrapeData = await crawlResponse.json();
    console.log(`🔥 Firecrawl successful for ${website}`);
    console.log(`📄 Content length: ${scrapeData.data?.markdown?.length || 0} characters`);

    if (scrapeData.success && scrapeData.data) {
      const jobs = extractJobsFromScrapeData(scrapeData.data, website);
      console.log(`🔥 Firecrawl extracted ${jobs.length} jobs from ${website}`);
      return jobs;
    }

    return [];
  } catch (error) {
    console.error(`❌ Firecrawl error for ${website}:`, error);
    return [];
  }
}

function extractJobsFromScrapeData(scrapeData: any, sourceWebsite: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  const content = scrapeData.markdown || scrapeData.content || '';
  const baseUrl = scrapeData.metadata?.sourceURL || sourceWebsite;

  console.log(`📄 Processing content from ${sourceWebsite}, length: ${content.length}`);

  // More sophisticated job detection for different platforms
  if (sourceWebsite.includes('backstage.com')) {
    console.log(`🎭 Using Backstage extraction logic`);
    return extractBackstageJobs(content, baseUrl);
  } else if (sourceWebsite.includes('castingnetworks.com')) {
    console.log(`🎬 Using Casting Networks extraction logic`);
    return extractCastingNetworksJobs(content, baseUrl);
  } else if (sourceWebsite.includes('spotlight.com')) {
    console.log(`💡 Using Spotlight extraction logic`);
    return extractSpotlightJobs(content, baseUrl);
  } else if (sourceWebsite.includes('actorsaccess.com')) {
    console.log(`🎪 Using Actors Access extraction logic`);
    return extractActorsAccessJobs(content, baseUrl);
  }

  // Generic extraction as fallback
  console.log(`🌐 Using generic extraction logic`);
  return extractGenericJobs(content, baseUrl);
}

function extractBackstageJobs(content: string, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  console.log(`🎭 Backstage: Looking for casting patterns...`);
  
  // Look for Backstage-specific patterns
  const jobPatterns = [
    /casting.*?for.*?["']([^"']{20,80})["']/gi,
    /seeking.*?actors.*?for.*?["']([^"']{20,80})["']/gi,
    /now.*?casting.*?["']([^"']{20,80})["']/gi
  ];

  let totalMatches = 0;
  for (const [patternIndex, pattern] of jobPatterns.entries()) {
    console.log(`🔍 Backstage: Trying pattern ${patternIndex + 1}`);
    let match;
    let patternMatches = 0;
    while ((match = pattern.exec(content)) !== null) {
      totalMatches++;
      patternMatches++;
      const title = cleanJobTitle(match[1]);
      console.log(`📝 Backstage: Found potential job "${title}" (${title.length} chars)`);
      
      if (title && title.length > 10 && !isJunkTitle(title)) {
        jobs.push(createJobObject(title, content, baseUrl, 'backstage.com'));
        console.log(`✅ Backstage: Added job "${title}"`);
      } else {
        console.log(`❌ Backstage: Rejected "${title}" - too short or junk`);
      }
    }
    console.log(`🔍 Backstage: Pattern ${patternIndex + 1} found ${patternMatches} matches`);
  }

  console.log(`🎭 Backstage: Total matches found: ${totalMatches}, valid jobs: ${jobs.length}`);
  return jobs;
}

function extractCastingNetworksJobs(content: string, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  console.log(`🎬 Casting Networks: Splitting content into sections...`);
  
  // Look for Casting Networks specific patterns
  const sections = content.split(/\n\s*\n/).filter(section => 
    section.length > 100 && 
    (/casting|audition|role|seeking/i.test(section))
  );

  console.log(`🎬 Casting Networks: Found ${sections.length} potential sections`);

  for (const [index, section] of sections.entries()) {
    console.log(`🔍 Processing section ${index + 1}: ${section.slice(0, 100)}...`);
    
    const titleMatch = section.match(/^([^.\n]{15,80})/);
    if (titleMatch) {
      const title = cleanJobTitle(titleMatch[1]);
      console.log(`📝 CN: Extracted title "${title}" (${title.length} chars)`);
      
      if (title && !isJunkTitle(title)) {
        jobs.push(createJobObject(title, section, baseUrl, 'castingnetworks.com'));
        console.log(`✅ CN: Added job "${title}"`);
      } else {
        console.log(`❌ CN: Rejected "${title}" - junk title`);
      }
    } else {
      console.log(`❌ CN: No title found in section`);
    }
  }

  console.log(`🎬 Casting Networks: Final count: ${jobs.length} jobs`);
  return jobs;
}

function extractSpotlightJobs(content: string, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  console.log(`💡 Spotlight: Looking for UK casting patterns...`);
  
  // Spotlight UK specific patterns
  const jobSections = content.split(/(?=casting|audition)/i).filter(section => 
    section.length > 50 && 
    /casting|audition|role/i.test(section)
  );

  console.log(`💡 Spotlight: Found ${jobSections.length} potential job sections`);

  for (const [index, section] of jobSections.entries()) {
    console.log(`🔍 Spotlight: Processing section ${index + 1}`);
    
    const titleMatch = section.match(/^([^.\n]{10,60})/);
    if (titleMatch) {
      const title = cleanJobTitle(titleMatch[1]);
      console.log(`📝 Spotlight: Extracted "${title}" (${title.length} chars)`);
      
      if (title && !isJunkTitle(title)) {
        jobs.push(createJobObject(title, section, baseUrl, 'spotlight.com'));
        console.log(`✅ Spotlight: Added job "${title}"`);
      } else {
        console.log(`❌ Spotlight: Rejected "${title}" - junk title`);
      }
    }
  }

  console.log(`💡 Spotlight: Final count: ${jobs.length} jobs`);
  return jobs;
}

function extractActorsAccessJobs(content: string, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  console.log(`🎪 Actors Access: Looking for breakdown patterns...`);
  
  // Actors Access patterns
  const titlePatterns = [
    /breakdown.*?for.*?["']([^"']{15,60})["']/gi,
    /casting.*?["']([^"']{15,60})["']/gi
  ];

  let totalMatches = 0;
  for (const [patternIndex, pattern] of titlePatterns.entries()) {
    console.log(`🔍 AA: Trying pattern ${patternIndex + 1}`);
    let match;
    let patternMatches = 0;
    while ((match = pattern.exec(content)) !== null) {
      totalMatches++;
      patternMatches++;
      const title = cleanJobTitle(match[1]);
      console.log(`📝 AA: Found "${title}" (${title.length} chars)`);
      
      if (title && !isJunkTitle(title)) {
        jobs.push(createJobObject(title, content, baseUrl, 'actorsaccess.com'));
        console.log(`✅ AA: Added job "${title}"`);
      } else {
        console.log(`❌ AA: Rejected "${title}" - junk title`);
      }
    }
    console.log(`🔍 AA: Pattern ${patternIndex + 1} found ${patternMatches} matches`);
  }

  console.log(`🎪 Actors Access: Total matches: ${totalMatches}, valid jobs: ${jobs.length}`);
  return jobs;
}

function extractGenericJobs(content: string, baseUrl: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  console.log(`🌐 Generic: Processing ${content.length} characters of content`);
  
  // Generic patterns for any casting site
  const sections = content.split(/\n\s*\n/).filter(section => 
    section.length > 80 && 
    /casting|audition|actor|actress|role/i.test(section)
  );

  console.log(`🌐 Generic: Found ${sections.length} potential sections, processing first 10`);

  for (const [index, section] of sections.slice(0, 10).entries()) { // Limit to first 10 potential jobs
    console.log(`🔍 Generic: Processing section ${index + 1}: ${section.slice(0, 50)}...`);
    
    const lines = section.split('\n').filter(line => line.trim().length > 10);
    if (lines.length > 0) {
      const title = cleanJobTitle(lines[0]);
      console.log(`📝 Generic: Extracted "${title}" (${title.length} chars)`);
      
      if (title && !isJunkTitle(title)) {
        jobs.push(createJobObject(title, section, baseUrl, getDomainName(baseUrl)));
        console.log(`✅ Generic: Added job "${title}"`);
      } else {
        console.log(`❌ Generic: Rejected "${title}" - junk title or too short`);
      }
    }
  }

  console.log(`🌐 Generic: Final count: ${jobs.length} jobs`);
  return jobs;
}

function createJobObject(title: string, content: string, baseUrl: string, platform: string): ScrapedJob {
  // Extract additional details from content
  const locationMatch = content.match(/(?:location|filming|based in|area|city)[\s:]*([^\n\r]{5,50})/i);
  const compensationMatch = content.match(/(?:pay|rate|compensation|salary|fee|budget)[\s:]*([^\n\r]{5,50})/i);
  const deadlineMatch = content.match(/(?:deadline|apply by|submissions due|closes)[\s:]*([^\n\r]{5,30})/i);
  const projectMatch = content.match(/(?:project|film|show|series)[\s:]*["']?([^"'\n\r]{5,40})["']?/i);
  const ageMatch = content.match(/(?:age|ages)[\s:]*([0-9\s\-to]{3,15})/i);
  const genderMatch = content.match(/(?:male|female|non-binary|any gender|gender)/i);

  // Determine role type from content
  let roleType = 'background';
  if (/lead|principal|main.*character|starring/i.test(content)) {
    roleType = 'lead';
  } else if (/supporting|secondary|featured|co-star/i.test(content)) {
    roleType = 'supporting';
  }

  // Extract genres
  const genres = [];
  const genrePatterns = ['drama', 'comedy', 'thriller', 'horror', 'action', 'romance', 'sci-fi', 'documentary'];
  for (const genre of genrePatterns) {
    if (new RegExp(genre, 'i').test(content)) {
      genres.push(genre);
    }
  }

  return {
    title: title,
    project_name: projectMatch?.[1]?.trim(),
    description: content.slice(0, 300) + (content.length > 300 ? '...' : ''),
    location: locationMatch?.[1]?.trim(),
    compensation_range: compensationMatch?.[1]?.trim(),
    role_type: roleType,
    application_deadline: deadlineMatch?.[1]?.trim(),
    external_url: baseUrl,
    source_platform: platform,
    requirements: extractRequirements(content),
    genres: genres.length > 0 ? genres : undefined,
    age_range: ageMatch?.[1]?.trim(),
    gender_requirements: genderMatch?.[0]?.trim()
  };
}

function cleanJobTitle(title: string): string {
  return title
    .replace(/^[^\w]+/, '') // Remove leading non-word characters
    .replace(/[^\w\s\-:()]+$/, '') // Remove trailing non-word characters except basic punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function isJunkTitle(title: string): boolean {
  const junkPatterns = [
    /^https?:\/\//i, // URLs
    /\.(com|org|net|gov)/i, // Domain names
    /^[^a-zA-Z]*$/, // No letters
    /^(img|image|photo|picture|logo)/i, // Image references
    /^(click|link|href|src)/i, // HTML/link artifacts
    /^(div|span|p|h\d|ul|li)/i, // HTML tags
    /^[\w\s]*\.svg\)/i, // SVG references
    /casting.*networks.*casting/i, // Site navigation
    /^(home|about|contact|login|register|sign)/i // Navigation items
  ];

  const isJunk = junkPatterns.some(pattern => pattern.test(title)) || title.length > 100;
  
  if (isJunk) {
    console.log(`🗑️ Junk title detected: "${title}"`);
  }
  
  return isJunk;
}

function getDomainName(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return url;
  }
}

function extractRequirements(content: string): string {
  const requirementPatterns = [
    /(?:requirements|looking for|must have|seeking)[\s:]*([^\n\r]{20,200})/i,
    /(?:age|height|experience|skills)[\s:]*([^\n\r]{10,100})/i
  ];

  const requirements = [];
  for (const pattern of requirementPatterns) {
    const match = content.match(pattern);
    if (match) {
      requirements.push(match[1].trim());
    }
  }

  return requirements.length > 0 ? requirements.join('; ') : '';
}
