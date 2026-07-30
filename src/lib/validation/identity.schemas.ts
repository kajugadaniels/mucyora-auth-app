import { z } from "zod";
import { authFlowConfig } from "@/config/auth-flow.config";
import { validationMessages } from "./validation-messages";

export const identityImageSchema = z
    .custom<File>(
        (value) =>
            typeof File !== "undefined" &&
            value instanceof File,
        validationMessages.required,
    )
    .superRefine((file, context) => {
        if (
            !authFlowConfig.image.acceptedTypes.some(
                (type) => type === file.type,
            )
        ) {
            context.addIssue({
                code: "custom",
                message: validationMessages.imageType,
            });
        }

        if (
            file.size >
            authFlowConfig.image.maximumBytes
        ) {
            context.addIssue({
                code: "custom",
                message: validationMessages.imageSize,
            });
        }
    });

export const identityDocumentFormSchema = z.object({
    file: identityImageSchema,
    scenario: z.enum([
        "success",
        "rejected",
        "unavailable",
    ]),
});

export const liveCheckFormSchema = z.object({
    scenario: z.enum([
        "success",
        "retry",
        "pending",
        "failed",
        "unavailable",
    ]),
    acceptedGuidance: z.boolean().refine(
        (value) => value,
        "Confirm that you have reviewed the capture guidance.",
    ),
});

export type IdentityDocumentFormValues =
    z.infer<typeof identityDocumentFormSchema>;

export type LiveCheckFormValues =
    z.infer<typeof liveCheckFormSchema>;
