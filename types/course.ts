import { Lesson } from "@prisma/client"

// export type Lesson = {
//   title: string;
//   slug: string;
//   number: number;
//   downloadUrl: string;
//   sourceUrl?: string;
//   videoId: string;
//   text: string;
// };

// intersection type => combine 2 types together
export type LessonWithPath = Lesson & { path: string };
