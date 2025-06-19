import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');
const transcriptApiUrl = Deno.env.get('TRANSCRIPT_API_URL') || 'http://localhost:3002'; // Default to local for testing
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// URL-specific action sets based on content type
const actionSets = {
  "blog post": [
    [
      {
        title: "Summarize Article",
        description: "Create a concise summary of the main points",
        icon: "🧠"
      },
      {
        title: "Extract Key Takeaways",
        description: "List the most important insights",
        icon: "🔍"
      },
      {
        title: "Generate Tweet Thread",
        description: "Turn this into an engaging Twitter thread",
        icon: "🐦"
      }
    ],
    [
      {
        title: "Rewrite Simply",
        description: "Rewrite in simpler, easier language",
        icon: "✍️"
      },
      {
        title: "Create Professional Email",
        description: "Transform into a professional email format",
        icon: "📧"
      },
      {
        title: "Write Pros and Cons",
        description: "Analyze advantages and disadvantages",
        icon: "⚖️"
      }
    ],
    [
      {
        title: "Extract Notable Quotes",
        description: "Find and highlight memorable quotes from the article",
        icon: "💬"
      },
      {
        title: "SEO Analysis",
        description: "Suggest SEO improvements and keywords",
        icon: "🔍"
      },
      {
        title: "Create Quiz Questions",
        description: "Generate quiz questions based on the content",
        icon: "❓"
      }
    ],
    [
      {
        title: "Infographic Outline",
        description: "Create an outline for a visual infographic",
        icon: "📊"
      },
      {
        title: "Podcast Script",
        description: "Transform into a podcast episode script",
        icon: "🎙️"
      },
      {
        title: "Related Articles",
        description: "Suggest similar articles and topics",
        icon: "🔗"
      }
    ],
    [
      {
        title: "LinkedIn Article",
        description: "Adapt for LinkedIn publishing format",
        icon: "💼"
      },
      {
        title: "Video Script",
        description: "Create a YouTube video script from this content",
        icon: "📹"
      },
      {
        title: "Newsletter Content",
        description: "Transform into newsletter format",
        icon: "📧"
      }
    ],
    [
      {
        title: "Academic Summary",
        description: "Create an academic-style summary with citations",
        icon: "🎓"
      },
      {
        title: "Social Media Calendar",
        description: "Plan social media posts from this content",
        icon: "📅"
      },
      {
        title: "Book Chapter",
        description: "Expand into a book chapter format",
        icon: "📚"
      }
    ]
  ],
  "GitHub repository": [
    [
      {
        title: "Explain Project",
        description: "Describe what this project does and its purpose",
        icon: "🧠"
      },
      {
        title: "Installation Guide",
        description: "Create step-by-step setup instructions",
        icon: "🔍"
      },
      {
        title: "Tech Stack Summary",
        description: "List technologies and frameworks used",
        icon: "⚙️"
      }
    ],
    [
      {
        title: "Generate README",
        description: "Create a professional README template",
        icon: "📝"
      },
      {
        title: "Code Review Points",
        description: "Suggest areas for code improvement",
        icon: "💡"
      },
      {
        title: "Learning Path",
        description: "Create a study guide for this technology",
        icon: "🎓"
      }
    ],
    [
      {
        title: "API Documentation",
        description: "Generate API documentation from the code",
        icon: "📚"
      },
      {
        title: "Deployment Guide",
        description: "Create deployment instructions",
        icon: "🚀"
      },
      {
        title: "Contributing Guidelines",
        description: "Write guidelines for contributors",
        icon: "👥"
      }
    ],
    [
      {
        title: "Security Analysis",
        description: "Identify potential security considerations",
        icon: "🔒"
      },
      {
        title: "Performance Optimization",
        description: "Suggest performance improvements",
        icon: "⚡"
      },
      {
        title: "Testing Strategy",
        description: "Create a testing plan and examples",
        icon: "🧪"
      }
    ],
    [
      {
        title: "Architecture Overview",
        description: "Explain the project architecture and design",
        icon: "🏗️"
      },
      {
        title: "Troubleshooting Guide",
        description: "Create common issues and solutions",
        icon: "🔧"
      },
      {
        title: "Feature Roadmap",
        description: "Suggest future features and improvements",
        icon: "🗺️"
      }
    ],
    [
      {
        title: "Portfolio Project",
        description: "Create a portfolio description of this project",
        icon: "💼"
      },
      {
        title: "Interview Prep",
        description: "Prepare talking points for technical interviews",
        icon: "🎯"
      },
      {
        title: "Open Source Guidelines",
        description: "Create guidelines for open source contribution",
        icon: "🌟"
      }
    ]
  ],
  "product page": [
    [
      {
        title: "Feature Summary",
        description: "List key features and benefits",
        icon: "🧠"
      },
      {
        title: "Comparison Points",
        description: "Create comparison criteria for similar products",
        icon: "⚖️"
      },
      {
        title: "Sales Email",
        description: "Write a professional sales email",
        icon: "📧"
      }
    ],
    [
      {
        title: "Review Template",
        description: "Create a product review template",
        icon: "📝"
      },
      {
        title: "FAQ Generator",
        description: "Generate common questions about this product",
        icon: "❓"
      },
      {
        title: "LinkedIn Post",
        description: "Create a LinkedIn post about this product",
        icon: "💼"
      }
    ],
    [
      {
        title: "Pricing Analysis",
        description: "Analyze pricing strategy and value proposition",
        icon: "💰"
      },
      {
        title: "Target Audience",
        description: "Identify and describe the target market",
        icon: "🎯"
      },
      {
        title: "Marketing Copy",
        description: "Create compelling marketing copy",
        icon: "📢"
      }
    ],
    [
      {
        title: "Competitive Analysis",
        description: "Compare with competitors and alternatives",
        icon: "🔍"
      },
      {
        title: "Use Case Scenarios",
        description: "Create specific use case examples",
        icon: "💡"
      },
      {
        title: "Implementation Guide",
        description: "Write a guide for implementing this product",
        icon: "📋"
      }
    ],
    [
      {
        title: "ROI Calculator",
        description: "Create an ROI calculation template",
        icon: "📊"
      },
      {
        title: "Social Media Campaign",
        description: "Design a social media campaign",
        icon: "📱"
      },
      {
        title: "Customer Success Story",
        description: "Write a customer success story template",
        icon: "👥"
      }
    ],
    [
      {
        title: "Technical Specifications",
        description: "Extract and organize technical details",
        icon: "⚙️"
      },
      {
        title: "Integration Guide",
        description: "Create integration instructions",
        icon: "🔗"
      },
      {
        title: "Support Documentation",
        description: "Generate support and troubleshooting docs",
        icon: "🛠️"
      }
    ]
  ],
  "YouTube video": [
    [
      {
        title: "Video Summary",
        description: "Create a concise summary of the video content",
        icon: "📹"
      },
      {
        title: "Key Points",
        description: "Extract the main points and takeaways",
        icon: "🔍"
      },
      {
        title: "Deep Analysis",
        description: "Provide detailed analysis and insights",
        icon: "🧠"
      }
    ],
    [
      {
        title: "Discussion Questions",
        description: "Generate questions for further discussion",
        icon: "❓"
      },
      {
        title: "Related Topics",
        description: "Suggest related topics and videos",
        icon: "🔗"
      },
      {
        title: "Social Media Post",
        description: "Create engaging social media content",
        icon: "📱"
      }
    ],
    [
      {
        title: "Study Notes",
        description: "Create structured study notes from the video",
        icon: "📝"
      },
      {
        title: "Action Plan",
        description: "Extract actionable steps from the content",
        icon: "✅"
      },
      {
        title: "Timeline Breakdown",
        description: "Break down the video into timeline segments",
        icon: "⏰"
      }
    ],
    [
      {
        title: "Expert Commentary",
        description: "Add expert insights and commentary",
        icon: "🎯"
      },
      {
        title: "Controversy Analysis",
        description: "Identify and analyze controversial points",
        icon: "⚖️"
      },
      {
        title: "Future Implications",
        description: "Discuss future implications and trends",
        icon: "🔮"
      }
    ],
    [
      {
        title: "Educational Quiz",
        description: "Create quiz questions based on the video",
        icon: "🎓"
      },
      {
        title: "Research Topics",
        description: "Suggest topics for further research",
        icon: "🔬"
      },
      {
        title: "Debate Points",
        description: "Generate debate topics from the content",
        icon: "💭"
      }
    ],
    [
      {
        title: "Content Repurposing",
        description: "Suggest ways to repurpose this content",
        icon: "♻️"
      },
      {
        title: "Audience Analysis",
        description: "Analyze the target audience and appeal",
        icon: "👥"
      },
      {
        title: "Production Notes",
        description: "Create notes for video production",
        icon: "🎬"
      }
    ]
  ],
  "YouTube sitcom": [
    [
      {
        title: "Episode Summary",
        description: "Create a summary of the sitcom episode",
        icon: "📺"
      },
      {
        title: "Character Analysis",
        description: "Analyze the characters and their interactions",
        icon: "👥"
      },
      {
        title: "Humor Analysis",
        description: "Break down the comedy elements and jokes",
        icon: "😄"
      }
    ],
    [
      {
        title: "Plot Discussion",
        description: "Discuss the storyline and plot points",
        icon: "📖"
      },
      {
        title: "Cultural References",
        description: "Identify and explain cultural references",
        icon: "🌍"
      },
      {
        title: "Fan Theories",
        description: "Generate interesting fan theories",
        icon: "💭"
      }
    ],
    [
      {
        title: "Comedy Writing Tips",
        description: "Extract comedy writing techniques used",
        icon: "✍️"
      },
      {
        title: "Character Development",
        description: "Analyze character growth and arcs",
        icon: "📈"
      },
      {
        title: "Social Commentary",
        description: "Identify social issues and commentary",
        icon: "🗣️"
      }
    ],
    [
      {
        title: "Behind the Scenes",
        description: "Speculate on production and filming details",
        icon: "🎬"
      },
      {
        title: "Memorable Quotes",
        description: "Extract and analyze memorable lines",
        icon: "💬"
      },
      {
        title: "Episode Ranking",
        description: "Rate this episode within the series",
        icon: "⭐"
      }
    ],
    [
      {
        title: "Crossover Ideas",
        description: "Suggest crossover scenarios with other shows",
        icon: "🔄"
      },
      {
        title: "Spin-off Concepts",
        description: "Generate spin-off show ideas",
        icon: "🎭"
      },
      {
        title: "Audience Reactions",
        description: "Predict and analyze audience responses",
        icon: "👂"
      }
    ],
    [
      {
        title: "Comedy Analysis",
        description: "Break down different types of humor used",
        icon: "😂"
      },
      {
        title: "Season Context",
        description: "Place episode in broader season context",
        icon: "📅"
      },
      {
        title: "Cultural Impact",
        description: "Analyze the show's cultural significance",
        icon: "🌟"
      }
    ]
  ],
  "YouTube movie": [
    [
      {
        title: "Movie Summary",
        description: "Create a comprehensive movie summary",
        icon: "🎬"
      },
      {
        title: "Character Analysis",
        description: "Analyze the main characters and their arcs",
        icon: "👥"
      },
      {
        title: "Plot Analysis",
        description: "Break down the storyline and plot twists",
        icon: "📖"
      }
    ],
    [
      {
        title: "Themes & Messages",
        description: "Identify the main themes and messages",
        icon: "💡"
      },
      {
        title: "Cinematography Review",
        description: "Analyze the visual elements and direction",
        icon: "🎥"
      },
      {
        title: "Recommendation",
        description: "Create a movie recommendation with reasons",
        icon: "⭐"
      }
    ],
    [
      {
        title: "Soundtrack Analysis",
        description: "Analyze the music and sound design",
        icon: "🎵"
      },
      {
        title: "Historical Context",
        description: "Provide historical and cultural context",
        icon: "📚"
      },
      {
        title: "Director's Style",
        description: "Analyze the director's filmmaking style",
        icon: "🎭"
      }
    ],
    [
      {
        title: "Genre Analysis",
        description: "Examine how it fits within its genre",
        icon: "🏷️"
      },
      {
        title: "Symbolism & Motifs",
        description: "Identify symbolic elements and recurring motifs",
        icon: "🔍"
      },
      {
        title: "Critical Reception",
        description: "Analyze reviews and critical response",
        icon: "📰"
      }
    ],
    [
      {
        title: "Box Office Analysis",
        description: "Discuss commercial performance and impact",
        icon: "💰"
      },
      {
        title: "Awards Potential",
        description: "Evaluate awards and recognition potential",
        icon: "🏆"
      },
      {
        title: "Sequel Possibilities",
        description: "Discuss potential sequels or spin-offs",
        icon: "🔄"
      }
    ],
    [
      {
        title: "Fan Theories",
        description: "Generate interesting fan theories",
        icon: "💭"
      },
      {
        title: "Behind the Scenes",
        description: "Speculate on production challenges",
        icon: "🎬"
      },
      {
        title: "Cultural Impact",
        description: "Analyze the movie's cultural influence",
        icon: "🌟"
      }
    ]
  ],
  "documentation": [
    [
      {
        title: "Quick Start Guide",
        description: "Create a simplified getting started guide",
        icon: "🚀"
      },
      {
        title: "Key Concepts",
        description: "Extract and explain the main concepts",
        icon: "🧠"
      },
      {
        title: "Common Use Cases",
        description: "List typical usage scenarios",
        icon: "💡"
      }
    ],
    [
      {
        title: "Troubleshooting Guide",
        description: "Create a troubleshooting section",
        icon: "🔧"
      },
      {
        title: "Best Practices",
        description: "Extract recommended practices",
        icon: "⭐"
      },
      {
        title: "Learning Path",
        description: "Create a structured learning sequence",
        icon: "🎓"
      }
    ],
    [
      {
        title: "API Reference",
        description: "Generate API documentation structure",
        icon: "📚"
      },
      {
        title: "Code Examples",
        description: "Create practical code examples",
        icon: "💻"
      },
      {
        title: "Configuration Guide",
        description: "Write configuration instructions",
        icon: "⚙️"
      }
    ],
    [
      {
        title: "Security Guidelines",
        description: "Extract security considerations",
        icon: "🔒"
      },
      {
        title: "Performance Tips",
        description: "Create performance optimization guide",
        icon: "⚡"
      },
      {
        title: "Migration Guide",
        description: "Write upgrade and migration instructions",
        icon: "🔄"
      }
    ],
    [
      {
        title: "Integration Examples",
        description: "Create integration tutorials",
        icon: "🔗"
      },
      {
        title: "Testing Guide",
        description: "Write testing procedures and examples",
        icon: "🧪"
      },
      {
        title: "Deployment Guide",
        description: "Create deployment instructions",
        icon: "🚀"
      }
    ],
    [
      {
        title: "FAQ Generator",
        description: "Generate frequently asked questions",
        icon: "❓"
      },
      {
        title: "Glossary",
        description: "Create a glossary of technical terms",
        icon: "📖"
      },
      {
        title: "Video Tutorial Script",
        description: "Create a script for video tutorials",
        icon: "📹"
      }
    ]
  ],
  "news article": [
    [
      {
        title: "News Summary",
        description: "Create a concise news summary",
        icon: "📰"
      },
      {
        title: "Key Facts",
        description: "Extract the most important facts",
        icon: "🔍"
      },
      {
        title: "Background Context",
        description: "Provide background information",
        icon: "📚"
      }
    ],
    [
      {
        title: "Analysis",
        description: "Provide analysis and implications",
        icon: "🧠"
      },
      {
        title: "Related Stories",
        description: "Suggest related news topics",
        icon: "🔗"
      },
      {
        title: "Social Media Post",
        description: "Create shareable social media content",
        icon: "📱"
      }
    ],
    [
      {
        title: "Timeline of Events",
        description: "Create a chronological timeline",
        icon: "⏰"
      },
      {
        title: "Stakeholder Analysis",
        description: "Identify key stakeholders and their positions",
        icon: "👥"
      },
      {
        title: "Impact Assessment",
        description: "Analyze potential impacts and consequences",
        icon: "📊"
      }
    ],
    [
      {
        title: "Expert Commentary",
        description: "Add expert insights and analysis",
        icon: "🎯"
      },
      {
        title: "Public Opinion",
        description: "Analyze public reaction and sentiment",
        icon: "🗣️"
      },
      {
        title: "Future Predictions",
        description: "Make predictions about future developments",
        icon: "🔮"
      }
    ],
    [
      {
        title: "Fact-Checking Points",
        description: "Identify claims that need verification",
        icon: "✅"
      },
      {
        title: "Bias Analysis",
        description: "Analyze potential bias in reporting",
        icon: "⚖️"
      },
      {
        title: "International Perspective",
        description: "Provide international context and views",
        icon: "🌍"
      }
    ],
    [
      {
        title: "Policy Implications",
        description: "Analyze policy and regulatory implications",
        icon: "📋"
      },
      {
        title: "Economic Impact",
        description: "Assess economic consequences",
        icon: "💰"
      },
      {
        title: "Historical Context",
        description: "Provide historical background and parallels",
        icon: "📚"
      }
    ]
  ],
  "portfolio": [
    [
      {
        title: "Portfolio Summary",
        description: "Create a professional summary",
        icon: "📋"
      },
      {
        title: "Skills Analysis",
        description: "Extract and categorize skills",
        icon: "⚙️"
      },
      {
        title: "Project Highlights",
        description: "Identify standout projects",
        icon: "⭐"
      }
    ],
    [
      {
        title: "Professional Bio",
        description: "Create a compelling bio",
        icon: "👤"
      },
      {
        title: "Recommendations",
        description: "Suggest improvements",
        icon: "💡"
      },
      {
        title: "LinkedIn Profile",
        description: "Create LinkedIn profile content",
        icon: "💼"
      }
    ],
    [
      {
        title: "Resume Content",
        description: "Extract content for resume sections",
        icon: "📄"
      },
      {
        title: "Cover Letter",
        description: "Create a cover letter template",
        icon: "✉️"
      },
      {
        title: "Interview Talking Points",
        description: "Prepare key talking points for interviews",
        icon: "🎯"
      }
    ],
    [
      {
        title: "Project Case Studies",
        description: "Create detailed case studies",
        icon: "📊"
      },
      {
        title: "Technical Skills Assessment",
        description: "Evaluate technical proficiency levels",
        icon: "🔧"
      },
      {
        title: "Career Path Analysis",
        description: "Suggest career development opportunities",
        icon: "🗺️"
      }
    ],
    [
      {
        title: "Networking Introduction",
        description: "Create networking elevator pitch",
        icon: "🤝"
      },
      {
        title: "Freelance Profile",
        description: "Optimize for freelance platforms",
        icon: "💼"
      },
      {
        title: "Personal Brand Statement",
        description: "Create a personal brand statement",
        icon: "🌟"
      }
    ],
    [
      {
        title: "Achievement Timeline",
        description: "Create a timeline of achievements",
        icon: "📅"
      },
      {
        title: "Skill Gap Analysis",
        description: "Identify areas for skill development",
        icon: "📈"
      },
      {
        title: "Portfolio Website Content",
        description: "Generate content for portfolio website",
        icon: "🌐"
      }
    ]
  ],
  "forum post": [
    [
      {
        title: "Question Analysis",
        description: "Analyze the main question or issue",
        icon: "❓"
      },
      {
        title: "Solution Summary",
        description: "Summarize the best solutions",
        icon: "✅"
      },
      {
        title: "Key Insights",
        description: "Extract valuable insights",
        icon: "💡"
      }
    ],
    [
      {
        title: "Follow-up Questions",
        description: "Generate follow-up questions",
        icon: "🔍"
      },
      {
        title: "Related Topics",
        description: "Suggest related discussions",
        icon: "🔗"
      },
      {
        title: "Knowledge Base",
        description: "Create documentation from the discussion",
        icon: "📚"
      }
    ],
    [
      {
        title: "Expert Response",
        description: "Create an expert-level response",
        icon: "🎯"
      },
      {
        title: "Step-by-Step Guide",
        description: "Create a detailed step-by-step solution",
        icon: "📋"
      },
      {
        title: "Common Mistakes",
        description: "Identify common mistakes to avoid",
        icon: "⚠️"
      }
    ],
    [
      {
        title: "Alternative Solutions",
        description: "Suggest alternative approaches",
        icon: "🔄"
      },
      {
        title: "Resource Compilation",
        description: "Compile helpful resources and links",
        icon: "📚"
      },
      {
        title: "Community Guidelines",
        description: "Create community discussion guidelines",
        icon: "👥"
      }
    ],
    [
      {
        title: "Troubleshooting Flowchart",
        description: "Create a troubleshooting decision tree",
        icon: "🔄"
      },
      {
        title: "Best Practices Summary",
        description: "Extract best practices from the discussion",
        icon: "⭐"
      },
      {
        title: "Future Discussion Topics",
        description: "Suggest topics for future discussions",
        icon: "🔮"
      }
    ],
    [
      {
        title: "Moderation Guidelines",
        description: "Create moderation guidelines for similar posts",
        icon: "🛡️"
      },
      {
        title: "FAQ Entry",
        description: "Create an FAQ entry from this discussion",
        icon: "❓"
      },
      {
        title: "Success Metrics",
        description: "Define how to measure solution success",
        icon: "📊"
      }
    ]
  ],
  "movie review": [
    [
      {
        title: "Review Summary",
        description: "Create a concise review summary",
        icon: "📝"
      },
      {
        title: "Rating Analysis",
        description: "Analyze the rating and scoring",
        icon: "⭐"
      },
      {
        title: "Key Points",
        description: "Extract the main review points",
        icon: "🔍"
      }
    ],
    [
      {
        title: "Recommendation",
        description: "Create a recommendation based on the review",
        icon: "👍"
      },
      {
        title: "Comparison",
        description: "Compare with similar movies",
        icon: "⚖️"
      },
      {
        title: "Trailer Analysis",
        description: "Analyze the movie trailer",
        icon: "🎬"
      }
    ],
    [
      {
        title: "Audience Analysis",
        description: "Analyze target audience and appeal",
        icon: "👥"
      },
      {
        title: "Box Office Prediction",
        description: "Predict commercial performance",
        icon: "💰"
      },
      {
        title: "Awards Potential",
        description: "Evaluate awards season potential",
        icon: "🏆"
      }
    ],
    [
      {
        title: "Director's Track Record",
        description: "Analyze director's previous work",
        icon: "🎭"
      },
      {
        title: "Genre Expectations",
        description: "Evaluate how it meets genre expectations",
        icon: "🏷️"
      },
      {
        title: "Cultural Significance",
        description: "Analyze cultural impact and relevance",
        icon: "🌟"
      }
    ],
    [
      {
        title: "Technical Analysis",
        description: "Analyze technical aspects (sound, visuals)",
        icon: "🎥"
      },
      {
        title: "Script Analysis",
        description: "Evaluate writing and dialogue quality",
        icon: "📜"
      },
      {
        title: "Marketing Strategy",
        description: "Analyze marketing and promotional approach",
        icon: "📢"
      }
    ],
    [
      {
        title: "Fan Reaction Prediction",
        description: "Predict fan and audience reactions",
        icon: "👂"
      },
      {
        title: "Sequel Potential",
        description: "Evaluate potential for sequels or franchises",
        icon: "🔄"
      },
      {
        title: "Historical Context",
        description: "Place in context of film history",
        icon: "📚"
      }
    ]
  ],
  "default": [
    [
      {
        title: "Summarize Content",
        description: "Create a concise summary",
        icon: "🧠"
      },
      {
        title: "Key Points",
        description: "Extract the most important points",
        icon: "🔍"
      },
      {
        title: "Generate Questions",
        description: "Create thoughtful questions based on content",
        icon: "❓"
      }
    ],
    [
      {
        title: "Rewrite Clearly",
        description: "Rewrite in clearer, simpler language",
        icon: "✍️"
      },
      {
        title: "Professional Summary",
        description: "Create a professional summary",
        icon: "💼"
      },
      {
        title: "Action Items",
        description: "Extract actionable items or next steps",
        icon: "⚙️"
      }
    ],
    [
      {
        title: "Content Analysis",
        description: "Provide detailed content analysis",
        icon: "📊"
      },
      {
        title: "Related Topics",
        description: "Suggest related topics and resources",
        icon: "🔗"
      },
      {
        title: "Social Media Content",
        description: "Create social media posts from this content",
        icon: "📱"
      }
    ],
    [
      {
        title: "Educational Content",
        description: "Transform into educational material",
        icon: "🎓"
      },
      {
        title: "Business Application",
        description: "Apply content to business context",
        icon: "💼"
      },
      {
        title: "Creative Adaptation",
        description: "Suggest creative ways to use this content",
        icon: "🎨"
      }
    ],
    [
      {
        title: "Research Topics",
        description: "Generate research topics from content",
        icon: "🔬"
      },
      {
        title: "Discussion Points",
        description: "Create discussion topics and questions",
        icon: "💭"
      },
      {
        title: "Future Implications",
        description: "Analyze future implications and trends",
        icon: "🔮"
      }
    ],
    [
      {
        title: "Content Repurposing",
        description: "Suggest ways to repurpose this content",
        icon: "♻️"
      },
      {
        title: "Audience Analysis",
        description: "Analyze target audience and appeal",
        icon: "👥"
      },
      {
        title: "Quality Assessment",
        description: "Evaluate content quality and credibility",
        icon: "⭐"
      }
    ]
  ]
};

// Helper function to generate dynamic actions based on content
async function generateDynamicActionSet(link: string, contentType: string, contentSummary?: string): Promise<Array<{title: string, description: string, icon: string}>> {
  const prompt = `You are LinkMage, generating unique AI actions for a ${contentType}.

URL: ${link}
${contentSummary ? `Content Summary: ${contentSummary}` : ''}

Generate 3 unique, creative, and contextually relevant actions that would be valuable for this specific content. These should be different from standard actions and tailored to this particular ${contentType}.

Each action should have:
- A clear, actionable title
- A brief description explaining what it does
- An appropriate emoji icon

Respond with VALID JSON in this EXACT format:
{
  "actions": [
    {
      "title": "Action Title 1",
      "description": "Brief description of what this action does",
      "icon": "🎯"
    },
    {
      "title": "Action Title 2", 
      "description": "Brief description of what this action does",
      "icon": "💡"
    },
    {
      "title": "Action Title 3",
      "description": "Brief description of what this action does", 
      "icon": "🚀"
    }
  ]
}

Make the actions creative, specific to this content, and genuinely useful.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are LinkMage. Always respond with valid JSON only. No extra text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content?.trim() || "";

    // Clean up the response
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    const parsed = JSON.parse(aiResponse);
    return parsed.actions || [];
  } catch (error) {
    console.error('Error generating dynamic actions:', error);
    // Fallback to default actions if dynamic generation fails
    return actionSets.default[0];
  }
}

// Helper function to detect YouTube content type
function detectYouTubeContentType(url: string): string {
  const urlLower = url.toLowerCase();
  
  // Check for specific YouTube patterns
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    // Check for common sitcom/movie keywords in URL
    const sitcomKeywords = ['sitcom', 'comedy', 'show', 'episode', 'season', 'series'];
    const movieKeywords = ['movie', 'film', 'trailer', 'cinema', 'theater'];
    const musicKeywords = ['music', 'song', 'album', 'concert', 'live', 'performance'];
    
    for (const keyword of sitcomKeywords) {
      if (urlLower.includes(keyword)) {
        return 'YouTube sitcom';
      }
    }
    
    for (const keyword of movieKeywords) {
      if (urlLower.includes(keyword)) {
        return 'YouTube movie';
      }
    }
    
    for (const keyword of musicKeywords) {
      if (urlLower.includes(keyword)) {
        return 'YouTube video';
      }
    }
    
    // Default to generic YouTube video
    return 'YouTube video';
  }
  
  return '';
}

// Function to extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Function to fetch transcript from external API
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
    console.log(`Fetching transcript for video ID: ${videoId} from external API`);
    
    const response = await fetch(`${transcriptApiUrl}/getTranscript?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log('Transcript not available for this video');
        return null;
      }
      console.error('Transcript API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.success && data.transcript) {
      console.log(`Successfully retrieved transcript, length: ${data.transcript.length} characters`);
      return data.transcript;
    } else {
      console.log('No transcript data in response');
      return null;
    }
    
  } catch (error) {
    console.error('Error fetching transcript from API:', error);
    return null;
  }
}

// Function to summarize transcript using Groq AI
async function summarizeTranscript(transcript: string, videoId: string): Promise<string> {
  try {
    const prompt = `You are analyzing a YouTube video transcript. Please provide a comprehensive summary with the following structure:

Video ID: ${videoId}

Transcript:
${transcript}

Please create a well-formatted summary with:

**Video Overview**
- What is this video about based on the transcript?
- What type of content is this (tutorial, review, entertainment, educational, etc.)?

**Key Topics Covered**
- What specific topics, subjects, or themes does this video discuss?
- What are the main points or key takeaways?

**Content Analysis**
- What are the most important insights from the video?
- What value does this video provide to viewers?

**Target Audience**
- Who would be most interested in this video?
- What level of expertise is required?

**Key Insights**
- What are the most important aspects of this video?
- What makes this content unique or valuable?

Format the response with clear headings and use bullet points where appropriate. Be specific and accurate based on the actual transcript content.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing YouTube video transcripts. Provide accurate, specific analysis based on the actual transcript content. Be detailed and helpful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Unable to generate summary';
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    return 'Unable to generate summary due to an error';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { link, actionSet = 0, manualType, generateDynamicActions = false } = await req.json().catch(() => ({}));

    if (!link) {
      return new Response(JSON.stringify({ error: 'Link is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate URL
    try {
      new URL(link);
    } catch {
      return new Response(JSON.stringify({
          type: "insufficient",
          purpose: "Invalid URL provided",
          actions: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if this is a YouTube URL and handle transcript analysis ONLY
    const videoId = extractYouTubeVideoId(link);
    let contentSummary: string | null = null;
    let contentAvailable = false;
    let transcriptErrorMessage = null;

    if (videoId) {
      console.log('YouTube video detected, attempting to analyze transcript for video ID:', videoId);
      try {
        const transcript = await fetchYouTubeTranscript(videoId);
        if (transcript && transcript.trim().length > 0) {
          console.log('Transcript found, generating analysis...');
          contentAvailable = true;
          contentSummary = await summarizeTranscript(transcript, videoId);
          console.log('Transcript analysis generated successfully');
        } else {
          // DO NOT call Groq with empty transcript!
          console.log('No transcript available for this video.');
          contentAvailable = false;
          contentSummary = null;
          transcriptErrorMessage = "Transcript could not be retrieved for this video. Please check if the video has subtitles or try another link.";
        }
      } catch (error) {
        console.error('Error processing YouTube transcript:', error);
        contentAvailable = false;
        contentSummary = null;
        transcriptErrorMessage = "Transcript could not be retrieved for this video. Please check if the video has subtitles or try another link.";
      }
    }

    // If manual type is provided, use it directly
    if (manualType && actionSets[manualType]) {
      const availableActions = actionSets[manualType];
      const normalizedActionSet = Math.max(0, actionSet % availableActions.length);
      const currentActionSet = availableActions[normalizedActionSet];
      const nextActionSet = (normalizedActionSet + 1) % availableActions.length;
      
      const responseData: any = {
        type: manualType,
        purpose: `User-selected ${manualType} content`,
        actions: currentActionSet,
        totalActionSets: availableActions.length,
        nextActionSet: availableActions.length > 1 && nextActionSet !== 0 ? nextActionSet : undefined
      };

      // Add transcript analysis for YouTube videos ONLY if transcript is available
      if (videoId) {
        if (contentAvailable && contentSummary) {
          responseData.contentAnalysis = contentSummary;
          responseData.contentAvailable = true;
        } else {
          responseData.contentAvailable = false;
          responseData.contentMessage = transcriptErrorMessage || "Transcript could not be retrieved for this video. Please check if the video has subtitles or try another link.";
        }
      }
      
      return new Response(JSON.stringify(responseData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Try to detect YouTube content type first
    const detectedYouTubeType = detectYouTubeContentType(link);
    
    let prompt = '';
    if (detectedYouTubeType) {
      prompt = `You are LinkMage, analyzing a YouTube URL to determine content type and purpose.

URL to analyze: ${link}
Detected type: ${detectedYouTubeType}

Based on the URL and detected type, provide a brief purpose/summary in one sentence.

Respond with VALID JSON in this EXACT format:
{
  "type": "${detectedYouTubeType}",
  "purpose": "brief_one_sentence_description_here"
}`;
    } else {
      prompt = `You are LinkMage, analyzing a URL to determine content type and purpose.

URL to analyze: ${link}

Analyze this URL and determine:
1. What type of content this likely is
2. A brief purpose/summary in one sentence

Respond with VALID JSON in this EXACT format:
{
  "type": "content_type_here",
  "purpose": "brief_one_sentence_description_here"
}

Choose type from: blog post, GitHub repository, YouTube video, YouTube sitcom, YouTube movie, documentation, product page, news article, portfolio, forum post, movie review, PDF, tweet, unknown`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are LinkMage. Always respond with valid JSON only. No extra text or formatting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices?.[0]?.message?.content?.trim() || "";

    // Logging for debugging
    console.log('Raw AI response:', aiResponse);

    // Clean up the response
    aiResponse = aiResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    let analysis;
    try {
      const parsed = JSON.parse(aiResponse);
      const contentType = parsed.type?.toLowerCase() || "unknown";
      
      // Select appropriate action set based on content type
      let availableActions = actionSets.default;
      if (actionSets[contentType]) {
        availableActions = actionSets[contentType];
      } else if (contentType.includes("github")) {
        availableActions = actionSets["GitHub repository"];
      } else if (contentType.includes("blog") || contentType.includes("article")) {
        availableActions = actionSets["blog post"];
      } else if (contentType.includes("product")) {
        availableActions = actionSets["product page"];
      } else if (contentType.includes("youtube") || contentType.includes("video")) {
        if (contentType.includes("sitcom")) {
          availableActions = actionSets["YouTube sitcom"];
        } else if (contentType.includes("movie")) {
          availableActions = actionSets["YouTube movie"];
        } else {
          availableActions = actionSets["YouTube video"];
        }
      } else if (contentType.includes("doc") || contentType.includes("manual")) {
        availableActions = actionSets["documentation"];
      } else if (contentType.includes("news")) {
        availableActions = actionSets["news article"];
      } else if (contentType.includes("portfolio")) {
        availableActions = actionSets["portfolio"];
      } else if (contentType.includes("forum") || contentType.includes("discussion")) {
        availableActions = actionSets["forum post"];
      } else if (contentType.includes("movie review") || contentType.includes("review")) {
        availableActions = actionSets["movie review"];
      }
      
      // Ensure actionSet is within bounds
      const normalizedActionSet = Math.max(0, actionSet % availableActions.length);
      const currentActionSet = availableActions[normalizedActionSet];
      
      // Calculate next action set, ensuring it cycles properly
      const nextActionSet = (normalizedActionSet + 1) % availableActions.length;
      
      // If we've exhausted all predefined sets and dynamic generation is requested
      if (generateDynamicActions && nextActionSet === 0 && availableActions.length > 1) {
        // Generate dynamic actions based on content
        const dynamicActions = await generateDynamicActionSet(link, contentType, contentSummary);
        
        analysis = {
          type: parsed.type || "unknown",
          purpose: parsed.purpose || "Web content ready for AI analysis",
          actions: dynamicActions,
          totalActionSets: availableActions.length,
          nextActionSet: undefined, // No more sets after dynamic generation
          isDynamic: true
        };
      } else {
        analysis = {
          type: parsed.type || "unknown",
          purpose: parsed.purpose || "Web content ready for AI analysis",
          actions: currentActionSet,
          totalActionSets: availableActions.length,
          nextActionSet: availableActions.length > 1 && nextActionSet !== 0 ? nextActionSet : undefined
        };
      }
      
      // Add content analysis for YouTube videos
      if (videoId && contentSummary) {
        analysis.contentAnalysis = contentSummary;
        analysis.contentAvailable = true;
      } else if (videoId) {
        analysis.contentAvailable = false;
        analysis.contentMessage = "Transcript could not be retrieved for this video. Please check if the video has subtitles or try another link.";
      }
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      console.error('Parse error:', parseError.message);
      
      analysis = {
        type: "unknown",
        purpose: "Web content ready for AI analysis",
        actions: actionSets.default[0],
        totalActionSets: actionSets.default.length,
        nextActionSet: 1
      };
      
      // Add content analysis for YouTube videos even in fallback case
      if (videoId && contentSummary) {
        analysis.contentAnalysis = contentSummary;
        analysis.contentAvailable = true;
      } else if (videoId) {
        analysis.contentAvailable = false;
        analysis.contentMessage = "Transcript could not be retrieved for this video. Please check if the video has subtitles or try another link.";
      }
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in analyze-link function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});