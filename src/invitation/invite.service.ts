import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InviteBodyDto } from "../dto/invite.dto";
import { Invitation } from "../entity/invite.entity";
import { User } from "../entity/user.entity";
import { DataSource, DeleteResult, QueryRunner, Repository } from "typeorm";

@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);

  constructor(
    @InjectRepository(Invitation)
    private readonly invites:Repository<Invitation>,
    @InjectRepository(User)
    private readonly users:Repository<User>,
    private readonly connect:DataSource
  ){}

  async getInviteRecipient(id:string):Promise<Invitation[]>{
    const user:User = await this.users.findOneBy({id});
    return this.invites.findBy({
      user,
      recipient_store:user.id
    });
  }

  async getInviteAdresser(id:string):Promise<Invitation[]>{
    return this.invites.findBy({
      addresser:id,
      addresser_store:id
    });
  } 

  async deleteInvite(inviteId:string):Promise<number>{
    const query:QueryRunner = this.connect.createQueryRunner();
    await query.connect();
    await query.startTransaction()
    try {
      const invite = await this.invites.findOneBy({id:inviteId});
      if (invite.is_adresser){
        const recip_invite = await this.invites.findOneBy({
          id:invite.recipient_invite_id
         });
        if (recip_invite){
          await this.invites.delete({
            id:invite.recipient_invite_id
          })
        }
      }
      const invites = await this.invites.delete({id:inviteId});
      await query.commitTransaction();
      return invites.affected;
    } catch (e) {
      this.logger.error(e);
      await query.rollbackTransaction()
    } finally {
      await query.release()
    }
  }

    async createInvite(userId:string,{recipient}:InviteBodyDto):Promise<Invitation>{
      const query:QueryRunner = this.connect.createQueryRunner();
      await query.connect();
      await query.startTransaction();
      try {
        const user:User = await this.users.findOneBy({id:recipient});
        const newRecipInvite:Invitation = this.invites.create({
          addresser:userId,
          recipient,
          addresser_store:userId,
          recipient_store:recipient,
          user
        });
        const newAdressInvite:Invitation = this.invites.create({
          addresser:userId,
          recipient,
          addresser_store:userId,
          recipient_store:recipient,
          is_adresser:true,
          recipient_invite_id:newRecipInvite.id,
          user
        });
        await this.invites.save([
          newRecipInvite,
          newAdressInvite
        ]);
        await query.commitTransaction();
        return newAdressInvite;
      } catch (e) {
        this.logger.error(e);
        await query.rollbackTransaction();
      } finally {
        await query.release();
      }
    }
}