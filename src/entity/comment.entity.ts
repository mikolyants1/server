import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./task.entity";

@Entity({name:"task_comments"})
export class Comment {
  @PrimaryGeneratedColumn("uuid",{name:"id"})
  id:string;

  @Column({name:"text",type:"varchar",length:255,nullable:false})
  text:string;

  @Column({name:"author",type:"varchar",length:255,nullable:false})
  author:string;

  @Column({name:"was_update",type:"boolean",default:false,nullable:false})
  was_update:boolean;

  @Column({name:"author_id",type:"varchar",length:255,nullable:false})
  author_id:string;

  @Column({name:"date",type:"bigint",nullable:false,default:Date.now()})
  date:number;

  @ManyToOne(() => Task,({comments}:Task) => comments,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  })
  @JoinColumn({name:"task_id",referencedColumnName:"id"})
  task:Task;
}