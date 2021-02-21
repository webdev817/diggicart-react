/* eslint-disable prettier/prettier */
import * as Yup from 'yup';
export const signupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  acceptTerms: Yup.boolean().oneOf(
    [true],
    'You must accept the terms of services',
  ),
  password: Yup.string()
    .min(6, 'Password too short!')
    .max(32, 'Password should less than 32 digits')
    .required('Password is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  ageLevel: Yup.string().required('Age level is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .when('password', {
      is: val => !!(val && val.length > 0),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'Both password need to be same',
      ),
    }),
});
