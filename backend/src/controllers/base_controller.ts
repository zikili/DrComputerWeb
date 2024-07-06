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
                if (req.query.userId != null) {
                    const myObjects = await this.model.find({ owner: req.query.userId });
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
            await newMyObject.save();
            res.status(201).json(newMyObject);
        } catch (err) {
            console.log(err)
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
            await updatedMyObject.save();
            res.status(200).json(updatedMyObject);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            await this.model.findByIdAndDelete(req.body.id);
            res.status(200).send();
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

export default BaseController 