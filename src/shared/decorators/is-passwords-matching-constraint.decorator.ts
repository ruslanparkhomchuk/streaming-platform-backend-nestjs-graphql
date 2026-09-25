import {
	type ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator";

import type { NewPasswordInput } from "@/modules/auth/password-recovery/inputs/new-password.input";

@ValidatorConstraint({ name: "IsPasswordsMatching", async: false })
export class IsPasswordsMatchingConstraint implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const object = args.object as NewPasswordInput;

		return object.password === passwordRepeat;
	}

	public defaultMessage() {
		return "Passwords do not match";
	}
}
