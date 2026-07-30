from frappe.utils import strip_html_tags, today
from frappe.website.doctype.blog_post.blog_post import (
	BlogPost as FrappeBlogPost,
	get_html_content_based_on_type,
)


BLOG_INTRO_MAX_LENGTH = 10000
META_TITLE_MAX_LENGTH = 60
META_DESCRIPTION_MAX_LENGTH = 140


class BlogPost(FrappeBlogPost):
	def validate(self):
		super(FrappeBlogPost, self).validate()

		if not self.blog_intro:
			content = get_html_content_based_on_type(self, "content", self.content_type)
			self.blog_intro = strip_html_tags(content[:BLOG_INTRO_MAX_LENGTH])

		if self.blog_intro:
			self.blog_intro = self.blog_intro[:BLOG_INTRO_MAX_LENGTH]

		if not self.meta_title:
			self.meta_title = self.title[:META_TITLE_MAX_LENGTH]
		else:
			self.meta_title = self.meta_title[:META_TITLE_MAX_LENGTH]

		if not self.meta_description:
			self.meta_description = self.blog_intro[:META_DESCRIPTION_MAX_LENGTH]
		else:
			self.meta_description = self.meta_description[:META_DESCRIPTION_MAX_LENGTH]

		if self.published and not self.published_on:
			self.published_on = today()

		if self.featured:
			if not self.meta_image:
				from frappe import _
				import frappe

				frappe.throw(_("A featured post must have a cover image"))
			self.reset_featured_for_other_blogs()

		self.set_read_time()
