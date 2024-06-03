import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ServerError } from 'src/utils/exception';

@Processor('send-mail')
export class EmailConsumer {
  constructor(private mailerService: MailerService) {}
  @Process('signUp')
  async signUpEmail(job: Job<unknown>) {
    const dataMail = await this.mailerService.sendMail({
      from: 'ledinhthang.work@gmail.com',
      to: job.data['to'],
      subject: '🌻 Take care of your health with SHIELD 🌻',
      template: '../../../../src/templates/email/welcome',
      context: {
        name: job.data['name'],
        password: job.data['password'],
      },
    });

    if (!dataMail) {
      throw new ServerError('Something went wrong!');
    }
  }
}
