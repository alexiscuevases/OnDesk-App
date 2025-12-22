export const TEAM_MEMBER_ROLES_OBJECT = {
	owner: "Owner",
	admin: "Admin",
	member: "Member",
	viewer: "Viewer",
} as const;
export const TEAM_MEMBER_ROLES = Object.keys(TEAM_MEMBER_ROLES_OBJECT) as (keyof typeof TEAM_MEMBER_ROLES_OBJECT)[];

export const TEAM_MEMBER_STATUSES_OBJECT = {
	active: "Active",
	inactive: "Inactive",
	pending: "Pending",
} as const;
export const TEAM_MEMBER_STATUSES = Object.keys(TEAM_MEMBER_STATUSES_OBJECT) as (keyof typeof TEAM_MEMBER_STATUSES_OBJECT)[];
