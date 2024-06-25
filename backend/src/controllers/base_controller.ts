import { Request, Response } from "express";
import mongoose from "mongoose";

class BaseController<ModelInterface>{
    model: mongoose.Model<ModelInterface>;

    constructor(model) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        try {
            if (req.params.id != null) {
                const students = await this.model.findById(req.params.id);
                return res.status(200).send(students);
            } else {
                if (req.query.name != null) {
                    const students = await this.model.find({ name: req.query.name });
                    return res.status(200).send(students);
                } else {
                    const students = await this.model.find();
                    return res.status(200).send(students);
                }
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async post(req: Request, res: Response) {
        const student = req.body;
        try {
            const newStudent = await this.model.create(student);
            res.status(201).json(newStudent);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async put(req: Request, res: Response) {
        const student = req.body;
        try {
            const updatedStudent = await this.model.findByIdAndUpdate(
                student._id,
                student,
                { new: true }
            );
            res.status(200).json(updatedStudent);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    delete(req: Request, res: Response) {
        //const student = req.body;
        try {
            //await this.model.findByIdAndDelete(student._id);
            res.status(200).send();
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

export default BaseController 