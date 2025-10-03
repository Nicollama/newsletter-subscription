/**
 * A standard regex pattern for basic email validation. 
 * This is used internally to validate the format without relying on external libraries.
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * VR-NS-001 & VR-NS-006: Represents a validated email address.
 * Encapsulates the core business rule (email format) and ensures case insensitivity 
 * by storing the canonical (lowercase) form.
 */
export class EmailAddress {
    // Stores the canonical (lowercase) email value
    private readonly value: string;

    private constructor(email: string) {
        // VR-NS-006: Always store canonical form
        this.value = email.toLowerCase(); 
    }

    /**
     * Factory method for creating and validating an EmailAddress.
     * @param rawEmail The raw email string input.
     * @returns A validated EmailAddress instance.
     * @throws {Error} if the email is invalid (VR-NS-001).
     */
    public static create(rawEmail: string): EmailAddress {
        if (!rawEmail || rawEmail.trim() === '') {
            throw new Error('email_required');
        }

        // VR-NS-001: Email format validation using internal regex
        if (!EMAIL_REGEX.test(rawEmail)) {
            throw new Error('invalid_format');
        }

        // Check for max length (optional rule, but good practice)
        if (rawEmail.length > 254) { 
            throw new Error('invalid_format');
        }

        return new EmailAddress(rawEmail);
    }

    public getValue(): string {
        return this.value;
    }

    // Optional: for comparison purposes if needed outside the repository
    public equals(other: EmailAddress): boolean {
        return this.value === other.value;
    }
}