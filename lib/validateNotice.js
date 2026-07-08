const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

/**
 * Validates a notice payload on the server.
 * Returns { valid: true, data } or { valid: false, errors }.
 * This is the source of truth for validation — the client-side
 * form also checks these rules, but the API route never trusts them.
 */
export function validateNotice(body) {
  const errors = {};
  const { title, body: content, category, priority, publishDate, image } = body || {};

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.title = "Title is required.";
  } else if (title.trim().length > 200) {
    errors.title = "Title must be under 200 characters.";
  }

  if (typeof content !== "string" || content.trim().length === 0) {
    errors.body = "Body is required.";
  }

  if (!CATEGORIES.includes(category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(", ")}.`;
  }

  if (!PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(", ")}.`;
  }

  const parsedDate = new Date(publishDate);
  if (!publishDate || isNaN(parsedDate.getTime())) {
    errors.publishDate = "A valid publish date is required.";
  }

  if (image !== undefined && image !== null && typeof image !== "string") {
    errors.image = "Image must be a URL string.";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      body: content.trim(),
      category,
      priority,
      publishDate: parsedDate,
      image: image && image.trim().length > 0 ? image.trim() : null,
    },
  };
}
