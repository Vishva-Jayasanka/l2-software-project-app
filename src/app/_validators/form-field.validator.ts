import {Teacher} from '../home/results/results.component';

export function FormFieldValidator(teachers: Teacher[]) {
  return !!(teachers && teachers.length);
}
