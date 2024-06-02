import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';
import { Invitation } from './invite.entity';
import { Friend } from './friend.entity';

@Entity({name:"users"})
export class User {
  @PrimaryGeneratedColumn("uuid",{name:"id"})
  id:string;

  @Column({name:"username",type:"varchar",length:255,nullable:false})
  username:string;

  @Column({name:"password",type:"varchar",length:255,unique:true,nullable:false})
  password:string;

  @Column({name:"tag",type:"varchar",length:255,unique:true,nullable:false})
  tag:string;

  @Column({name:"raiting",type:"integer",default:0})
  raiting:number;

  @OneToMany(() => Task,({user}:Task) => user)
  @JoinColumn({name:"tasks"})
  tasks:Task[];

  @OneToMany(() => Friend,({user}:Friend) => user)
  @JoinColumn({name:"friends"})
  friends:Friend[];

  @OneToMany(() => Invitation,({user}:Invitation) => user)
  @JoinColumn({name:"invitations"})
  invitations:Invitation[];
}