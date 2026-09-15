import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@/common/guards/auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getUserConversations(@CurrentUser() user: User) {
    return this.chatService.getUserConversations(user);
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chatService.getMessages(id, user);
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body('content') content: string,
    @Body('mediaUrl') mediaUrl?: string,
  ) {
    return this.chatService.sendMessage(id, user, content, mediaUrl);
  }
}
