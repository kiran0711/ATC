import { FormGroup } from '@angular/forms';

export function CheckUserName(controlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[controlName];
    const phoneNumberRegex = new RegExp('^[0-9]*$');
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      (phoneNumberRegex.test(control.value) &&
        control.value.length > 8 &&
        control.value.length < 12) ||
      re.test(String(control.value).toLowerCase())
    ) {
      matchingControl.setErrors(null);
    } else {
      matchingControl.setErrors({ userNameValidatorError: true });
    }
  };
}
