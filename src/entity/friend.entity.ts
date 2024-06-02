import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name:"user_friends"})
export class Friend {
  @PrimaryGeneratedColumn("uuid",{name:"id"})
  id:string;

  @Column({name:"friend_id",type:"varchar",length:255,nullable:false})
  friend_id:string;

  @ManyToOne(() => User,({friends}:User) => friends,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  })
  @JoinColumn({name:"user_id",referencedColumnName:"id"})
  user:User;
}