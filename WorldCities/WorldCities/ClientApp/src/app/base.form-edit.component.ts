import { Component } from '@angular/core';
import { AbstractControl, Form, FormGroup } from '@angular/forms';

@Component({
  template: ''
})
export class BaseFormEditComponent {

  public title: string;

  public form: FormGroup;

  public getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  public formFieldIsModified(fieldName: string): boolean {
    let field = this.getControl(fieldName);
    if (field?.dirty || field?.touched) {
      return true;
    }
    return false;
  }

  public formFieldIsInvalid(fieldName: string): boolean {
    let field = this.getControl(fieldName);
    if (field?.invalid) {
      return true;
    }
    return false;
  }

  public formFieldHasError(fieldName: string): boolean {
    if (this.formFieldIsInvalid(fieldName) && this.formFieldIsModified(fieldName)) {
      return true;
    }
    return false;
  }
}
