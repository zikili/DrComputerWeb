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
                const users = await this.model.findById(req.params.id);
                return res.status(200).send(users);
            } else {
                if (req.query.name != null) {
                    const users = await this.model.find({ name: req.query.name });
                    return res.status(200).send(users);
                } else {
                    const users = await this.model.find();
                    return res.status(200).send(users);
                }
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async post(req: Request, res: Response) {
        const user = req.body;
        try {
            const newUser = await this.model.create(user);
            res.status(201).json(newUser);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async put(req: Request, res: Response) {
        const user = req.body;
        try {
            const updatedUser = await this.model.findByIdAndUpdate(
                user._id,
                user,
                { new: true }
            );
            res.status(200).json(updatedUser);
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