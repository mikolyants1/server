import { Column, Entity,  JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name:"user_invitations"})
export class Invitation {
  @PrimaryGeneratedColumn("uuid",{name:"id"})
  id:string;

  @Column({name:"addresser",type:"varchar",length:255,nullable:false})
  addresser:string;

  @Column({name:"recipient",type:"varchar",length:255,nullable:false})
  recipient:string;

  @Column({name:"addresser_store",type:"varchar",length:255,nullable:false})
  addresser_store:string;

  @Column({name:"recipient_store",type:"varchar",length:255,nullable:false})
  recipient_store:string;

  @Column({name:"is_adresser",type:"varchar",length:255,default:false})
  is_adresser:boolean;

  @Column({name:"recipient_invite_id",type:"varchar",length:255,default:""})
  recipient_invite_id:string;

  @ManyToOne(() => User,({invitations}:User) => invitations,{
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  })
  @JoinColumn({name:"user_id",referencedColumnName:"id"})
  user:User;
}