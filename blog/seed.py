"""
seed.py  -  Populate Blog Categories, a Blogger, and Blog Posts
for the blog Frappe app.

Run from your bench root:
    bench --site blog.local execute blog.seed.run
"""

import frappe
from frappe.utils import today


# ─────────────────────────────────────────────
# Seed data
# ─────────────────────────────────────────────

# Simple titles — Frappe will use these as the `name` (slugified or as-is)
CATEGORY_TITLES = ["Technology", "Science", "Business", "Health", "Travel"]

BLOGGER_EMAIL = "seed.blogger@blog.local"
BLOGGER_FULL  = "Seed Blogger"
BLOGGER_SHORT = "Seed"

POSTS = [
    {
        "title":         "The Rise of Generative AI in 2025",
        "blog_intro":    "Generative AI has transformed every industry. Here is a clear-eyed look at what actually changed this year.",
        "blog_category": "Technology",
        "meta_image":    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80",
        "content":       "<h2>A year that rewired everything</h2><p>2025 will be remembered as the year AI stopped being a buzzword and became infrastructure. Models improved faster than anyone predicted, and the gap between research and production effectively vanished.</p><h3>Key breakthroughs</h3><ul><li>Multi-modal reasoning now runs on consumer hardware.</li><li>Code generation tools reached 90% accuracy on standard benchmarks.</li><li>Real-time voice synthesis became indistinguishable from human speech.</li></ul>",
    },
    {
        "title":         "Why Open-Source LLMs Are Winning",
        "blog_intro":    "Closed proprietary models dominated 2023. By mid-2025 the open-source alternatives closed the gap and in some domains overtook them.",
        "blog_category": "Technology",
        "meta_image":    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80",
        "content":       "<h2>The open-source surge</h2><p>When Meta released its Llama family under a permissive licence the floodgates opened. Thousands of fine-tuned variants appeared within weeks, each targeting a niche: legal, medical, coding, customer support.</p><p>The advantages are clear: no API costs, full data privacy, and the ability to customise at the weights level.</p>",
    },
    {
        "title":         "Building Scalable APIs with FastAPI and Docker",
        "blog_intro":    "A practical guide to designing and deploying production-ready REST APIs using Python's fastest micro-framework.",
        "blog_category": "Technology",
        "meta_image":    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=80",
        "content":       "<h2>Why FastAPI?</h2><p>FastAPI combines Python type hints with OpenAPI auto-documentation and async I/O, giving you the speed of Node.js with the readability of Python.</p><h3>Containerising with Docker</h3><p>A minimal Dockerfile is all you need to ship a reproducible environment. Combine it with Docker Compose for a local dev environment that mirrors production exactly.</p>",
    },
    {
        "title":         "The James Webb Telescope Biggest Discoveries So Far",
        "blog_intro":    "Two years of data from the most powerful space telescope ever built has already rewritten several chapters of cosmology.",
        "blog_category": "Science",
        "meta_image":    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
        "content":       "<h2>A new window on the universe</h2><p>JWST infrared sensitivity lets it peer through dust clouds that were opaque to Hubble, revealing star-forming regions and the earliest galaxies in unprecedented detail.</p><h3>Top revelations</h3><ol><li>Galaxies formed far earlier than standard models predicted.</li><li>The atmosphere of exoplanet TRAPPIST-1e shows intriguing chemical signatures.</li><li>Stellar nurseries in the Carina Nebula captured in stunning detail.</li></ol>",
    },
    {
        "title":         "CRISPR Beyond the Hype: Real Therapies in 2025",
        "blog_intro":    "Gene editing moved from laboratory curiosity to approved treatment. A look at what is working and what comes next.",
        "blog_category": "Science",
        "meta_image":    "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&q=80",
        "content":       "<h2>From bench to bedside</h2><p>The FDA approval of casgevy, a CRISPR-based treatment for sickle cell disease, marked a turning point. For the first time, a tool that edits the human genome is a licensed medicine.</p><h3>Conditions in clinical trials</h3><ul><li>Beta-thalassemia</li><li>Transthyretin amyloidosis</li><li>Certain hereditary blindness disorders</li></ul>",
    },
    {
        "title":         "Remote Work in 2025: The Data Finally Settles the Debate",
        "blog_intro":    "Five years of post-pandemic work experiments have produced enough data to draw real conclusions and the picture is nuanced.",
        "blog_category": "Business",
        "meta_image":    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80",
        "content":       "<h2>What the research actually says</h2><p>Productivity studies consistently show that knowledge workers perform comparably at home and in the office for deep focused work. Collaboration and serendipitous innovation however suffer at distance.</p><h3>The hybrid sweet spot</h3><p>Companies that mandate 2 to 3 office days a week report the best outcomes on both axes. Fully remote or fully in-office models each have measurable downsides.</p>",
    },
    {
        "title":         "The Startup Funding Drought Is Over: What Changed?",
        "blog_intro":    "After two brutal years of down-rounds and layoffs, venture capital is flowing again. Understanding what drove the turnaround.",
        "blog_category": "Business",
        "meta_image":    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80",
        "content":       "<h2>How the cycle turned</h2><p>Interest rate cuts in late 2024 unlocked LP capital that had been sitting on the sidelines. Combined with genuine excitement around AI applications, deal counts rose sharply in Q1 2025.</p><h3>Where the money is going</h3><ul><li>AI infrastructure: GPU clouds and model training tooling.</li><li>Climate tech: carbon capture and grid-scale storage.</li><li>Healthcare AI: diagnostic models and drug discovery.</li></ul>",
    },
    {
        "title":         "Why Sleep Is the Most Underrated Performance Tool",
        "blog_intro":    "The science of sleep has exploded over the past decade. Here is what elite athletes, neuroscientists, and CEOs now know about optimising rest.",
        "blog_category": "Health",
        "meta_image":    "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=1200&q=80",
        "content":       "<h2>Sleep debt is real and cumulative</h2><p>Chronic sleep restriction below 7 hours impairs reaction time, memory consolidation, immune function, and emotional regulation even when subjective sleepiness fades after a few days.</p><h3>Evidence-based improvements</h3><ul><li>Consistent wake time even on weekends is the single highest-leverage habit.</li><li>Blackout curtains reduce cortisol spikes from early light exposure.</li><li>A cool bedroom helps core body temperature drop during deep sleep.</li></ul>",
    },
    {
        "title":         "The Mediterranean Diet: What 50 Years of Research Tells Us",
        "blog_intro":    "No eating pattern has more rigorous long-term evidence behind it. A comprehensive look at what the Mediterranean diet actually involves.",
        "blog_category": "Health",
        "meta_image":    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
        "content":       "<h2>More than olive oil and pasta</h2><p>The traditional Mediterranean diet is characterised by high vegetable, legume, nut, and fish intake with olive oil as the primary fat source. It is as much a social pattern as a nutritional one.</p><h3>What the evidence shows</h3><ul><li>30 to 35 percent reduction in major cardiovascular events.</li><li>Reduced incidence of type 2 diabetes.</li><li>Lower all-cause mortality in observational cohorts.</li></ul>",
    },
    {
        "title":         "Hidden Gems: Southeast Asia Beyond Bangkok and Bali",
        "blog_intro":    "The most visited cities in Southeast Asia have priced themselves out for budget travellers. These under-the-radar destinations offer the same magic at a fraction of the cost.",
        "blog_category": "Travel",
        "meta_image":    "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80",
        "content":       "<h2>Rethinking the itinerary</h2><p>Over-tourism is a genuine problem in the region headline destinations. But the infrastructure that grew to serve those tourist flows has also made surrounding areas more accessible.</p><h3>Five places worth your time</h3><ol><li>Kampot Cambodia: riverside colonial town and world-class pepper.</li><li>Vang Vieng Laos: karst limestone scenery and kayaking.</li><li>Flores Indonesia: gateway to Komodo with world-class diving.</li><li>Phu Quoc Vietnam: quieter northern beaches once you leave the resort strip.</li></ol>",
    },
    {
        "title":         "How to Travel Slowly and Why You Should",
        "blog_intro":    "The 10-cities-in-14-days itinerary is a trap. Slow travel is cheaper, more rewarding, more sustainable, and better for your mental health.",
        "blog_category": "Travel",
        "meta_image":    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80",
        "content":       "<h2>The case against the highlight reel</h2><p>Speed tourism optimises for social media checkboxes. You see the famous viewpoint, take the photo, and move on before you have eaten a single local meal. Slow travel inverts this logic.</p><h3>Practical slow travel rules</h3><ul><li>Stay at least one week in each location.</li><li>Cook in your accommodation at least twice.</li><li>Use ground transport whenever the journey is under 8 hours.</li><li>Leave one full day per week with no plan whatsoever.</li></ul>",
    },
]


# ─────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────

def ensure_categories():
    """
    Insert each Blog Category by title and return a dict {title: name}.
    We look up by title so we handle whatever name Frappe assigns.
    """
    title_to_name = {}

    for title in CATEGORY_TITLES:
        # Check if a category with this title already exists
        existing = frappe.db.get_value("Blog Category", {"title": title}, "name")
        if existing:
            title_to_name[title] = existing
            print(f"  [=] Category exists:  {title} -> {existing}")
        else:
            doc = frappe.get_doc({"doctype": "Blog Category", "title": title})
            doc.insert(ignore_permissions=True)
            frappe.db.commit()
            title_to_name[title] = doc.name
            print(f"  [+] Category created: {title} -> {doc.name}")

    return title_to_name


def ensure_blogger():
    """Create seed User + Blogger if missing. Returns the Blogger name."""

    if not frappe.db.exists("User", BLOGGER_EMAIL):
        user = frappe.get_doc({
            "doctype":            "User",
            "email":              BLOGGER_EMAIL,
            "first_name":         BLOGGER_FULL,
            "new_password":       "Seed@12345",
            "enabled":            1,
            "send_welcome_email": 0,
        })
        user.insert(ignore_permissions=True)
        user.add_roles("Blogger")
        frappe.db.commit()
        print(f"  [+] User created: {BLOGGER_EMAIL}")
    else:
        print(f"  [=] User exists:  {BLOGGER_EMAIL}")

    blogger_name = frappe.db.get_value("Blogger", {"user": BLOGGER_EMAIL}, "name")
    if not blogger_name:
        blogger = frappe.get_doc({
            "doctype":    "Blogger",
            "full_name":  BLOGGER_FULL,
            "short_name": BLOGGER_SHORT,
            "user":       BLOGGER_EMAIL,
        })
        blogger.insert(ignore_permissions=True)
        frappe.db.commit()
        blogger_name = blogger.name
        print(f"  [+] Blogger created: {blogger_name}")
    else:
        print(f"  [=] Blogger exists:  {blogger_name}")

    return blogger_name


def seed_posts(blogger_name, title_to_name):
    """Insert Blog Posts. Uses title_to_name map to resolve category names."""
    created = 0
    skipped = 0

    for post in POSTS:
        if frappe.db.exists("Blog Post", {"title": post["title"]}):
            print(f"  [=] Post exists:   {post['title'][:60]}")
            skipped += 1
            continue

        # Resolve the actual stored category name
        cat_name = title_to_name.get(post["blog_category"])
        if not cat_name:
            print(f"  [!] Category not found for post: {post['blog_category']} — skipping post")
            skipped += 1
            continue

        doc = frappe.get_doc({
            "doctype":       "Blog Post",
            "title":         post["title"],
            "blog_intro":    post["blog_intro"],
            "content":       post["content"],
            "content_type":  "Rich Text",
            "blog_category": cat_name,
            "blogger":       blogger_name,
            "published":     1,
            "published_on":  today(),
            "meta_image":    post.get("meta_image", ""),
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        created += 1
        print(f"  [+] Post created:  {post['title'][:60]}")

    return created, skipped


# ─────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────

def run():
    """
    bench --site blog.local execute blog.seed.run
    """
    print("\n========================================")
    print(" Blog Seed - starting")
    print("========================================\n")

    frappe.set_user("Administrator")

    print("-- Step 1: Blog Categories --------------")
    title_to_name = ensure_categories()

    print("\n-- Step 2: Blogger ----------------------")
    blogger_name = ensure_blogger()

    print("\n-- Step 3: Blog Posts -------------------")
    created, skipped = seed_posts(blogger_name, title_to_name)

    print("\n========================================")
    print(f" Done: {created} post(s) created, {skipped} skipped.")
    print("========================================\n")
