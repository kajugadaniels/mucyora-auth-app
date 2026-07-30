import type { CitizenPreview } from "@/services/auth";

export const mockCitizenNationalId = "1990000000000001";

export const mockCitizen: CitizenPreview = {
    reference: "mock-citizen-reference",
    givenNames: "Aline",
    surname: "Mucyora",
    dateOfBirth: "1990-01-01",
    sex: "Female",
    nationality: "Rwandan",
};