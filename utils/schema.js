import { pgTable, PgVarchar, serial, text, varchar } from "drizzle-orm/pg-core";

export const MockInterview=pgTable('mockInterview',{
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAT'),
    mockId:varchar('mockId').notNull()
})

export const UserAnswer=pgTable('userAnswer',{
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating: varchar('rating').default('0'), // Avoid errors if missing rating
    userEmail:varchar('userEmail'),
    createdAt: text('createdAt'), // Store as text or use timestamp()
    bodyLanguageFeedback: text('bodyLanguageFeedback'), // New column for body language feedback
    voiceFeedback: text('voiceFeedback')  // New column for voice feedback
})
