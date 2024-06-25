import { Request, Response } from "express";
import mongoose from "mongoose";

class BaseController<ModelInterface>{
    model: mongoose.Model<ModelInterface>;

    constructor(model:mongoose.Model<ModelInterface>) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        try {
            if (req.params.id != null) {
                const myObjects = await this.model.findById(req.params.id);
                return res.status(200).send(myObjects);
            } else {
                if (req.query.name != null) {
                    const myObjects = await this.model.find({ name: req.query.name });
                    return res.status(200).send(myObjects);
                } else {
                    const myObjects = await this.model.find();
                    return res.status(200).send(myObjects);
                }
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async post(req: Request, res: Response) {
        const myObject = req.body;
        try {
            const newMyObject = await this.model.create(myObject);
            res.status(201).json(newMyObject);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async put(req: Request, res: Response) {
        const myObject = req.body;
        try {
            const updatedMyObject = await this.model.findByIdAndUpdate(
                myObject._id,
                myObject,
                { new: true }
            );
            res.status(200).json(updatedMyObject);
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