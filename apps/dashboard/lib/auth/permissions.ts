// Permission definitions for each resource in the dashboard application, reshaped as objects for fine-grained access control.

export const permissions = [
	// Job permissions
	{ action: "create", subject: "job" },
	{ action: "view", subject: "job", conditions: { scope: "any" } },
	{ action: "view", subject: "job", conditions: { scope: "own" } },
	{ action: "update", subject: "job", conditions: { scope: "any" } },
	{ action: "update", subject: "job", conditions: { scope: "own" } },
	{ action: "delete", subject: "job", conditions: { scope: "any" } },
	{ action: "delete", subject: "job", conditions: { scope: "own" } },
	{ action: "publish", subject: "job" },
	{ action: "archive", subject: "job" },

	// Candidate permissions
	{ action: "create", subject: "candidate" },
	{ action: "import", subject: "candidate" },
	{ action: "export", subject: "candidate" },
	{ action: "view", subject: "candidate", conditions: { scope: "any" } },
	{ action: "view", subject: "candidate", conditions: { scope: "own" } },
	{ action: "update", subject: "candidate", conditions: { scope: "any" } },
	{ action: "update", subject: "candidate", conditions: { scope: "own" } },
	{ action: "delete", subject: "candidate", conditions: { scope: "any" } },
	{ action: "delete", subject: "candidate", conditions: { scope: "own" } },
	{ action: "assign", subject: "candidate" },
	{ action: "move_stage", subject: "candidate" },
	{ action: "comment", subject: "candidate" },
	{ action: "share", subject: "candidate" },
	{ action: "tag", subject: "candidate" },
	{ action: "move_stage:screening", subject: "candidate" },
	{ action: "move_stage:interview", subject: "candidate" },
	{ action: "move_stage:offer", subject: "candidate" },

	// Interview permissions
	{ action: "schedule", subject: "interview", conditions: { scope: "any" } },
	{ action: "schedule", subject: "interview", conditions: { scope: "own" } },
	{ action: "update", subject: "interview", conditions: { scope: "any" } },
	{ action: "update", subject: "interview", conditions: { scope: "own" } },
	{ action: "cancel", subject: "interview", conditions: { scope: "any" } },
	{ action: "cancel", subject: "interview", conditions: { scope: "own" } },
	{ action: "feedback:submit", subject: "interview" },
	{
		action: "feedback:view",
		subject: "interview",
		conditions: { scope: "any" },
	},
	{
		action: "feedback:view",
		subject: "interview",
		conditions: { scope: "own" },
	},

	// Pipeline permissions
	{ action: "configure", subject: "pipeline" },
	{ action: "view", subject: "pipeline" },

	// User permissions
	{ action: "invite", subject: "user" },
	{ action: "view", subject: "user", conditions: { scope: "any" } },
	{ action: "view", subject: "user", conditions: { scope: "own" } },
	{ action: "update", subject: "user", conditions: { scope: "any" } },
	{ action: "update", subject: "user", conditions: { scope: "own" } },
	{ action: "deactivate", subject: "user" },
	{ action: "role:assign", subject: "user" },

	// Team permissions
	{ action: "create", subject: "team" },
	{ action: "update", subject: "team" },
	{ action: "delete", subject: "team" },
	{ action: "assign_members", subject: "team" },
	{ action: "manage", subject: "team" },

	// Settings permissions
	{ action: "update", subject: "settings" },
	{ action: "view", subject: "settings" },

	// Integration permissions
	{ action: "manage", subject: "integration" },
	{ action: "view", subject: "integration" },

	// Reporting permissions
	{ action: "view:jobs", subject: "reporting" },
	{ action: "view:candidates", subject: "reporting" },
	{ action: "view:diversity", subject: "reporting" },
	{ action: "view:performance", subject: "reporting" },
	{ action: "export", subject: "reporting" },

	// Organization permissions
	{ action: "manage", subject: "organization" },
	{ action: "manage", subject: "billing" },
] as const;

export type Permission = (typeof permissions)[number];
export type Resource = Permission["subject"];
