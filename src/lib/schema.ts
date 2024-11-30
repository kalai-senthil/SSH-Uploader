import { z } from "zod";

export const addIPFormSchema = z.object({
    name: z.string().min(2).max(50),
    ip: z.string().min(2).max(50),
    password: z.string().min(2).max(500),
});

export type AddIPFormSchema = typeof addIPFormSchema;

export const addCommandFormSchema = z.object({
    name: z.string().min(2).max(50),
    ip: z.string().min(2).max(50),
});

export const addPathFormSchema = z.object({
    name: z.string().min(2).max(50),
    ip: z.string().min(2).max(50),
});

export type AddCommandFormSchema = typeof addCommandFormSchema;