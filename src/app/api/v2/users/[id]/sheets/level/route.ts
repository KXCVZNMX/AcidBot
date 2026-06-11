// import {z} from "zod";
//
// const UserLevelSchema = z.object({
//     id: z.string().min(1),
//     clal: z
//         .string()
//         .length(64)
//         .regex(/^[A-Za-z0-9]+$/),
//     level: z
//         .string()
//         .regex(/\b(?:[1-6]|15|[7-9]\+?|1[0-4]\+?)\b/),
//     profile: z
//         .enum(['true', 'false'])
//         .transform((value) => value === 'true')
//         .optional(),
// })
//
// export async function GET(
//
// )