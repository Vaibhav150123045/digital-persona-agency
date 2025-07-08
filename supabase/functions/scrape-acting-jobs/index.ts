import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2.49.8'

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

interface UserProfile {
  id: string;
  name: string;
  location?: string;
  actor_type?: string;
  favorite_genres?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websites, searchTerms = [] }: JobScrapeRequest = await req.json();
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');

    console.log('🚀 Starting job scraping with enhanced child role filtering');
    console.log('🔧 Firecrawl API available:', !!firecrawlApiKey);
    console.log('🌐 Target websites:', websites);

    const scrapedJobs: ScrapedJob[] = [];

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Test database connectivity
    console.log('🔍 Testing database connectivity...');
    const { data: testData, error: testError } = await supabase
      .from('casting_opportunities')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database connection failed:', testError);
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    console.log('✅ Database connected successfully');

    // Get user profiles for filtering
    console.log('👥 Getting user profiles for filtering...');
    const { data: userProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, name, location, actor_type, favorite_genres');
    
    if (profilesError) {
      console.error('❌ Error fetching user profiles:', profilesError);
    }

    console.log(`👥 Found ${userProfiles?.length || 0} user profiles`);

    // Website configurations
    const websiteConfigs = [
      {
        url: "https://www.backstage.com/casting/",
        platform: "backstage.com",
        requiresAuth: false
      },
      {
        url: "https://app.spotlight.com/jobs/all-opportunities",
        platform: "spotlight.com", 
        requiresAuth: true
      },
      {
        url: "https://www.castingnetworks.com/auditions",
        platform: "castingnetworks.com",
        requiresAuth: false
      }
    ];

    const targetConfigs = websites?.length ? 
      websiteConfigs.filter(config => websites.includes(config.url)) : 
      websiteConfigs;

    for (const config of targetConfigs) {
      try {
        console.log(`\n🌐 Processing website: ${config.url}`);
        
        if (!firecrawlApiKey) {
          console.log('❌ No Firecrawl API key available');
          continue;
        }

        console.log(`🔥 Using Firecrawl for ${config.platform}`);
        const extractedJobs = await scrapeWithFirecrawl(config.url, config.platform, firecrawlApiKey);
        console.log(`🔥 Firecrawl returned ${extractedJobs.length} jobs`);

        // Filter and validate jobs
        const validJobs = extractedJobs.filter((job, index) => {
          const validation = validateJobData(job);
          if (!validation.isValid) {
            console.log(`❌ Job ${index + 1} invalid: ${validation.reason}`);
            return false;
          }
          return true;
        });

        scrapedJobs.push(...validJobs);
        console.log(`✅ Valid jobs from ${config.url}: ${validJobs.length}`);

      } catch (error) {
        console.error(`❌ Error scraping ${config.url}:`, error.message);
      }
    }

    console.log(`\n📊 Total valid jobs found: ${scrapedJobs.length}`);

    if (scrapedJobs.length === 0) {
      console.log('⚠️ No jobs found - returning early');
      return new Response(
        JSON.stringify({
          success: true,
          message: "No valid jobs found during scraping",
          totalFound: 0,
          newJobs: 0,
          duplicates: 0,
          rejected: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Save jobs to database with enhanced user-specific filtering
    let savedCount = 0;
    let duplicateCount = 0;
    let rejectedCount = 0;
    
    for (const [index, job] of scrapedJobs.entries()) {
      try {
        console.log(`\n🔍 Processing job ${index + 1}/${scrapedJobs.length}: "${job.title}"`);
        
        // Enhanced child role filtering - reject immediately if it's a child role
        if (isChildRole(job)) {
          console.log(`🚫 CHILD ROLE DETECTED - Rejecting: "${job.title}"`);
          rejectedCount++;
          continue;
        }
        
        // Check for duplicates
        const cleanTitle = job.title.replace(/[%_'"]/g, '').substring(0, 50);
        
        const { data: existing, error: searchError } = await supabase
          .from('casting_opportunities')
          .select('id, title, source_platform')
          .eq('source_platform', job.source_platform)
          .ilike('title', `%${cleanTitle}%`)
          .limit(10);

        if (searchError) {
          console.error('❌ Error checking duplicates:', searchError);
        }

        let isDuplicate = false;
        if (existing && existing.length > 0) {
          for (const existingJob of existing) {
            const similarity = calculateTitleSimilarity(job.title, existingJob.title);
            if (similarity > 0.85) {
              console.log(`🔄 DUPLICATE found (${Math.round(similarity * 100)}%)`);
              isDuplicate = true;
              break;
            }
          }
        }

        if (isDuplicate) {
          duplicateCount++;
          continue;
        }

        // Filter job based on user profiles (but child roles are already filtered out above)
        const isJobAppropriate = isJobAppropriateForUsers(job, userProfiles || []);
        if (!isJobAppropriate) {
          console.log(`🚫 Job filtered out - not appropriate for any users`);
          rejectedCount++;
          continue;
        }

        console.log('💾 Inserting new job...');
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
        .upsert(insertData, { onConflict: ['external_url'] }) // prevent duplicates
        .select('id, title');

        if (insertError) {
          console.error(`❌ DB Insert Error:`, insertError);
          rejectedCount++;
        } else {
          savedCount++;
          console.log(`✅ SAVED with ID: ${insertResult?.[0]?.id}`);
        }
      } catch (error) {
        console.error(`❌ Error processing job ${index + 1}:`, error.message);
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
        message: `Successfully scraped and saved ${savedCount} new jobs`,
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
    console.error('❌ Critical error in scrape-acting-jobs function:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Enhanced child role detection function
function isChildRole(job: ScrapedJob): boolean {
  const title = job.title.toLowerCase();
  const description = (job.description || '').toLowerCase();
  const requirements = (job.requirements || '').toLowerCase();
  const ageRange = (job.age_range || '').toLowerCase();
  
  const fullText = `${title} ${description} ${requirements} ${ageRange}`;
  
  // Comprehensive list of child-related keywords and patterns
  const childKeywords = [
    // Direct age references
    'child', 'children', 'kid', 'kids', 'baby', 'babies', 'toddler', 'toddlers', 
    'infant', 'infants', 'newborn', 'newborns',
    
    // Age ranges that indicate children
    'under 13', 'under 12', 'under 10', 'under 8', 'under 6', 'under 5',
    'ages 0-', 'ages 1-', 'ages 2-', 'ages 3-', 'ages 4-', 'ages 5-', 
    'ages 6-', 'ages 7-', 'ages 8-', 'ages 9-', 'ages 10-', 'ages 11-', 'ages 12-',
    '0-13', '1-13', '2-13', '3-13', '4-13', '5-13', '6-13', '7-13', '8-13', '9-13', '10-13', '11-13', '12-13',
    '0-12', '1-12', '2-12', '3-12', '4-12', '5-12', '6-12', '7-12', '8-12', '9-12', '10-12', '11-12',
    '0-10', '1-10', '2-10', '3-10', '4-10', '5-10', '6-10', '7-10', '8-10', '9-10',
    
    // School-related terms
    'elementary', 'kindergarten', 'preschool', 'pre-school', 'daycare', 'nursery school',
    
    // Family roles
    'son', 'daughter', 'little boy', 'little girl', 'young boy', 'young girl',
    
    // Specific age mentions
    '1 year old', '2 year old', '3 year old', '4 year old', '5 year old',
    '6 year old', '7 year old', '8 year old', '9 year old', '10 year old',
    '11 year old', '12 year old',
    
    // Alternative spellings and formats
    'yr old', 'yrs old', 'years old',
    
    // Other child-specific terms
    'minor', 'minors', 'juvenile', 'juveniles', 'youth under', 'children under'
  ];
  
  // Check if any child keywords are present
  const hasChildKeywords = childKeywords.some(keyword => fullText.includes(keyword));
  
  if (hasChildKeywords) {
    console.log(`🚫 Child role detected in "${job.title}" - Keywords found in: ${fullText.substring(0, 200)}...`);
    return true;
  }
  
  // Additional pattern matching for numeric age ranges
  const agePatterns = [
    /\b([0-9]|1[0-2])\s*[-–—]\s*([0-9]|1[0-7])\b/g, // Matches patterns like "5-12", "8-15", etc.
    /\bages?\s+([0-9]|1[0-2])\s*[-–—]\s*([0-9]|1[0-7])\b/gi, // "age 6-12", "ages 5-10"
    /\b([0-9]|1[0-2])\s*to\s*([0-9]|1[0-7])\s*years?\s*old\b/gi, // "5 to 12 years old"
  ];
  
  for (const pattern of agePatterns) {
    const matches = fullText.match(pattern);
    if (matches) {
      for (const match of matches) {
        // Extract the age numbers from the match
        const numbers = match.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          const minAge = parseInt(numbers[0]);
          const maxAge = parseInt(numbers[1]);
          
          // If the range includes ages 12 and under, it's likely a child role
          if (minAge <= 12 || maxAge <= 12) {
            console.log(`🚫 Child role detected in "${job.title}" - Age range pattern: ${match}`);
            return true;
          }
        }
      }
    }
  }
  
  return false;
}

function isJobAppropriateForUsers(job: ScrapedJob, userProfiles: UserProfile[]): boolean {
  if (!userProfiles || userProfiles.length === 0) {
    return false;
  }

  for (const user of userProfiles) {
    if (isJobAppropriateForUser(job, user)) {
      return true;
    }
  }

  return false;
}

function isJobAppropriateForUser(job: ScrapedJob, user: UserProfile): boolean {
  return isAgeAppropriate(job, user) && isLocationAppropriate(job, user);
}

function isAgeAppropriate(job: ScrapedJob, user: UserProfile): boolean {
  const ageRange = job.age_range?.toLowerCase() || '';
  const title = job.title.toLowerCase();
  const description = (job.description || '').toLowerCase();
  const requirements = (job.requirements || '').toLowerCase();
  
  const fullText = `${title} ${description} ${requirements} ${ageRange}`;
  
  // Teen-specific keywords (but not child keywords)
  const teenKeywords = [
    'teen', 'teenager', 'teenagers', 'adolescent', 'youth', 'high school',
    'ages 13-17', 'ages 14-18', 'ages 15-19', '13-17', '14-18', '15-19',
    'sophomore', 'junior', 'senior', 'freshman', 'young adult'
  ];

  const hasTeenKeywords = teenKeywords.some(keyword => fullText.includes(keyword));
  
  const userActorType = user.actor_type?.toLowerCase() || '';
  
  // If it has teen keywords but user is not teen/young actor, filter out
  if (hasTeenKeywords && !userActorType.includes('teen') && !userActorType.includes('young')) {
    return false;
  }
  
  return true;
}

function isLocationAppropriate(job: ScrapedJob, user: UserProfile): boolean {
  if (!job.location || !user.location) {
    return true;
  }
  
  const jobLocation = job.location.toLowerCase();
  const userLocation = user.location.toLowerCase();
  
  const extractLocation = (location: string) => {
    const patterns = [
      /([a-z\s]+),\s*([a-z]{2})/i,
      /([a-z\s]+)\s+area/i,
      /greater\s+([a-z\s]+)/i,
      /([a-z\s]+)\s+region/i
    ];
    
    for (const pattern of patterns) {
      const match = location.match(pattern);
      if (match) {
        return match[1].trim().toLowerCase();
      }
    }
    
    return location.split(',')[0].trim().toLowerCase();
  };
  
  const jobCity = extractLocation(jobLocation);
  const userCity = extractLocation(userLocation);
  
  if (jobCity.includes(userCity) || userCity.includes(jobCity)) {
    return true;
  }
  
  const jobState = jobLocation.match(/,\s*([a-z]{2})/i)?.[1]?.toLowerCase();
  const userState = userLocation.match(/,\s*([a-z]{2})/i)?.[1]?.toLowerCase();
  
  if (jobState && userState && jobState === userState) {
    return true;
  }
  
  const metroAreas = {
    'los angeles': ['la', 'hollywood', 'beverly hills', 'santa monica', 'burbank', 'pasadena'],
    'new york': ['nyc', 'manhattan', 'brooklyn', 'queens', 'bronx'],
    'san francisco': ['sf', 'bay area', 'oakland', 'san jose'],
    'chicago': ['il', 'illinois'],
    'atlanta': ['ga', 'georgia'],
    'miami': ['fl', 'florida']
  };
  
  for (const [metro, aliases] of Object.entries(metroAreas)) {
    const isJobInMetro = jobCity.includes(metro) || aliases.some(alias => jobCity.includes(alias));
    const isUserInMetro = userCity.includes(metro) || aliases.some(alias => userCity.includes(alias));
    
    if (isJobInMetro && isUserInMetro) {
      return true;
    }
  }
  
  return false;
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
  
  if (isJunkContent(job.title, job.description)) {
    return { isValid: false, reason: `Content appears to be junk: "${job.title}"` };
  }
  
  return { isValid: true };
}

async function scrapeWithFirecrawl(website: string, platform: string, apiKey: string): Promise<ScrapedJob[]> {
  try {
    console.log(`🔥 Sending request to Firecrawl for ${website}`);
    
    const extractionPrompt = `Extract all casting opportunities, auditions, and acting jobs from this page. For each opportunity, include:
    1. Job title
    2. Project name and description
    3. Location, compensation, requirements
    4. Specific URL link to the individual job posting
    
    Be thorough in finding actual job posting URLs, not just the main site URL.`;
    
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
          includeHtml: true,
          waitFor: 5000
        },
        extractorOptions: {
          mode: 'llm-extraction',
          extractionPrompt: extractionPrompt,
          extractionSchema: {
            type: "object",
            properties: {
              opportunities: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    project_name: { type: "string" },
                    description: { type: "string" },
                    location: { type: "string" },
                    compensation: { type: "string" },
                    requirements: { type: "string" },
                    deadline: { type: "string" },
                    role_type: { type: "string" },
                    job_url: { type: "string" }
                  },
                  required: ["title"]
                }
              }
            },
            required: ["opportunities"]
          }
        }
      }),
    });

    console.log(`🔥 Firecrawl response status: ${crawlResponse.status}`);

    if (!crawlResponse.ok) {
      const errorText = await crawlResponse.text();
      console.error(`🔥 Firecrawl failed for ${website}:`, errorText);
      return [];
    }

    const scrapeData = await crawlResponse.json();
    console.log(`🔥 Firecrawl successful for ${website}`);

    if (scrapeData.success && scrapeData.data) {
      const jobs = extractJobsFromScrapeData(scrapeData.data, website, platform);
      console.log(`🔥 Firecrawl extracted ${jobs.length} jobs`);
      return jobs;
    }

    return [];
  } catch (error) {
    console.error(`❌ Firecrawl error for ${website}:`, error.message);
    return [];
  }
}

function extractJobsFromScrapeData(scrapeData: any, sourceWebsite: string, platform: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  console.log(`📄 Processing content from ${sourceWebsite}`);

  if (scrapeData.llm_extraction && scrapeData.llm_extraction.opportunities && Array.isArray(scrapeData.llm_extraction.opportunities)) {
    console.log(`🎯 Found structured opportunities: ${scrapeData.llm_extraction.opportunities.length}`);
    
    scrapeData.llm_extraction.opportunities.forEach((opp: any, index: number) => {
      if (opp.title && opp.title.length > 3) {
        let jobUrl = sourceWebsite;
        
        if (opp.job_url && opp.job_url !== 'NO_SPECIFIC_URL' && opp.job_url !== sourceWebsite) {
          if (opp.job_url.startsWith('http')) {
            jobUrl = opp.job_url;
          } else if (opp.job_url.startsWith('/')) {
            const baseUrl = new URL(sourceWebsite);
            jobUrl = `${baseUrl.protocol}//${baseUrl.hostname}${opp.job_url}`;
          }
        } else {
          jobUrl = constructJobUrl(platform, sourceWebsite, opp.title, index);
        }
        
        const job: ScrapedJob = {
          title: cleanJobTitle(opp.title),
          project_name: opp.project_name || opp.title,
          description: opp.description || '',
          location: opp.location || '',
          compensation_range: opp.compensation || '',
          requirements: opp.requirements || '',
          role_type: determineRoleType(opp.role_type),
          external_url: jobUrl,
          source_platform: platform,
          genres: [],
          age_range: '',
          gender_requirements: ''
        };
        
        jobs.push(job);
        console.log(`✅ Added structured job ${index + 1}: "${job.title}"`);
      }
    });
  }

  return jobs;
}

function constructJobUrl(platform: string, baseUrl: string, title: string, index: number): string {
  const base = new URL(baseUrl);
  const slug = title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  if (platform.includes('backstage.com')) {
    return `${base.protocol}//${base.hostname}/casting/${slug}-${index}`;
  } else if (platform.includes('spotlight.com')) {
    return `${base.protocol}//${base.hostname}/jobs/${slug}-${index}`;
  } else if (platform.includes('castingnetworks.com')) {
    return `${base.protocol}//${base.hostname}/auditions/${slug}-${index}`;
  }
  
  return baseUrl;
}

function isJunkContent(title: string, description: string): boolean {
  const junkPatterns = [
    /^https?:\/\//i,
    /\.(com|org|net|gov)/i,
    /^[^a-zA-Z]*$/,
    /^(img|image|photo|picture|logo)/i,
    /^(click|link|href|src)/i,
    /^(div|span|p|h\d|ul|li)/i,
    /^(home|about|contact|login|register|sign)/i,
    /^(location|save|click|here|use|code)/i,
    /^\$?\d+\s*(off|on)/i,
    /^(menu|navigation|header|footer)/i,
    /^(recaptcha)/i
  ];

  const content = (title + ' ' + description).toLowerCase();
  return junkPatterns.some(pattern => pattern.test(content));
}

function cleanJobTitle(title: string): string {
  return title
    .replace(/^[^\w]+/, '')
    .replace(/[^\w\s\-:()'"]+$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function determineRoleType(roleType?: string): string {
  if (!roleType) return 'background';
  const type = roleType.toLowerCase();
  if (type.includes('lead') || type.includes('principal') || type.includes('main')) return 'lead';
  if (type.includes('supporting') || type.includes('featured')) return 'supporting';
  return 'background';
}
