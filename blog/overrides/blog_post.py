from frappe.utils import strip_html_tags, today
from frappe.website.doctype.blog_post.blog_post import (
	BlogPost as FrappeBlogPost,
	get_html_content_based_on_type,
)


META_TITLE_MAX_LENGTH = 60
META_DESCRIPTION_MAX_LENGTH = 140
PUBLISHED_STATUS = "Published"
DRAFT_STATUS = "Draft"


class BlogPost(FrappeBlogPost):
	def validate(self):
		super(FrappeBlogPost, self).validate()

		if not self.blog_intro:
			content = get_html_content_based_on_type(self, "content", self.content_type)
			self.blog_intro = strip_html_tags(content)

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

		# Keep the custom workflow field aligned with the actual publish flag,
		# even when the post is changed directly from the backend desk.
		if self.meta.has_field("custom_post_status"):
			current_status = str(self.custom_post_status or "").strip()
			if self.published:
				self.custom_post_status = PUBLISHED_STATUS
			elif current_status == PUBLISHED_STATUS:
				self.custom_post_status = DRAFT_STATUS

		if self.featured:
			if not self.meta_image:
				from frappe import _
				import frappe

				frappe.throw(_("A featured post must have a cover image"))
			self.reset_featured_for_other_blogs()

		self.set_read_time()
