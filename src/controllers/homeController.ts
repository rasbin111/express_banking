import {Request, Response, NextFunction} from "express";

export function HomePage(req:Request, res: Response){
    res.render("home", {
        title: "Home Page"
    })
}
