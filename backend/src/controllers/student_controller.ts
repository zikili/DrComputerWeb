import Student, { IStudent } from "../models/student_model";

import BaseController from "./base_controller";

class StudentController extends BaseController<IStudent> {
  constructor() {
    super(Student);
  }
}
export default new StudentController();
