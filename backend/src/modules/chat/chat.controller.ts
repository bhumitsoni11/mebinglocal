import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chats for current user' })
  getChats(@CurrentUser() user: any) {
    return this.chatService.getChatsForUser(user.id);
  }

  @Post('new/:targetUserId')
  @ApiOperation({ summary: 'Create a new chat with another user' })
  createChat(
    @CurrentUser() user: any,
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.chatService.createChat(user.id, targetUserId);
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: 'Get messages for a chat' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMessages(
    @CurrentUser() user: any,
    @Param('chatId') chatId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(user.id, chatId, page ? Number(page) : 1, limit ? Number(limit) : 50);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(
    @CurrentUser() user: any,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.sendMessage(user.id, createMessageDto);
  }
}
