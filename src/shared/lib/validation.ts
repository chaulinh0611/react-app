import { z } from "zod";


export const ProfileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    jobTitle: z.string().optional(),
    email: z.string().email("Invalid email address").optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;