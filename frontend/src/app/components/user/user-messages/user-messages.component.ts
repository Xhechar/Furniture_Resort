import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomOrder, Messages, Product, User } from '../../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { ProductsService } from '../../../services/products.service';
import { MessagesService } from '../../../services/messages.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationsComponent } from "../../notifications/notifications.component";

@Component({
  selector: 'app-user-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './user-messages.component.html',
  styleUrl: './user-messages.component.css'
})
export class UserMessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('chatBody') chatBodyRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;
  currentUser!: User;
  selectedProduct: Product | null = null;
  messages: Messages[] = [];
  messageText: string = '';
  isAdminTyping: boolean = false;
  hasCustomOrders: boolean = false;
  
  // For editing messages
  isEditing: boolean = false;
  editingMessageId: string = '';
  
  // Image upload
  selectedImage: File | null = null;
  selectedImagePreview: string = '';
  
  // Emoji picker
  showEmojiPicker: boolean = false;
  emojiCategories = [
    { name: 'smileys', icon: 'bx bx-smile' },
    { name: 'objects', icon: 'bx bx-gift' },
    { name: 'animals', icon: 'bx bx-cat' },
    { name: 'food', icon: 'bx bx-food-menu' },
    { name: 'travel', icon: 'bx bx-car' },
    { name: 'symbols', icon: 'bx bx-heart' }
  ];
  currentEmojiCategory: string = 'smileys';
  
  // Sample emoji data
  emojis = {
    smileys: ['😀', '😁', '😂', '🙂', '😊', '😇', '🥰', '😍', '😘', '😋', '😎', '🤩', '😏', '😣', '😮', '🤔'],
    objects: ['💼', '📱', '💻', '⌚', '📷', '🎮', '🎧', '💎', '🔑', '🛒', '🎁', '📚', '✏️', '📌', '🔍', '💡'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🦄'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝', '🍍', '🥭', '🍕', '🍔', '🍟', '🍦', '🍫'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🛸', '🚲', '⛵', '🚢', '🚆'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔴']
  };
  filteredEmojis: string[] = [];
  
  private productId: string = '';
  private receiverId: string = '';
  private messagePollingInterval: any;

  constructor(
    private messageService: MessagesService,
    private productService: ProductsService,
    private userService: UserService,
    private ns: NotificationsService
  ) {
    this.filteredEmojis = this.emojis.smileys;
  }

  ngOnInit(): void {
      this.userService.getSingleUser().subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUser = response.user as User;
            this.receiverId = this.currentUser.UserId;
            this.checkForCustomOrders();
            this.initializeChat();
          } else {
            this.ns.showMessage(response.error as string, false);
          }
        },
        error: (err) => {
            this.ns.showMessage(err.error.error as string, false);
        }
      })
  }

  checkForCustomOrders(): boolean {
    return (this.currentUser.CustomOrders as CustomOrder[]).length > 0;
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    
    // Clear polling interval
    if (this.messagePollingInterval) {
      clearInterval(this.messagePollingInterval);
    }
  }

  private initializeChat(): void {
    // Load chat messages
    this.loadMessages();
  }


  loadMessages(showLoading: boolean = true): void {
    if (showLoading) {
      // Show loading indicator if needed
    }
    
    this.messageService.getAllSendersMessages('verify').subscribe({
      next: (response) => {
        console.log(response);
        if (response.success) {
          this.messages = response.messages as Messages[];
          this.simulateAdminTyping();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
}

  simulateAdminTyping(): void {
    if (this.messages.length > 0 && 
        this.messages[this.messages.length - 1].SenderId === this.currentUser.UserId) {
      
      const randomDelay = Math.floor(Math.random() * 3) + 1;
      
      setTimeout(() => {
        this.isAdminTyping = true;
        
        setTimeout(() => {
          this.isAdminTyping = false;
        }, 2000 + Math.random() * 2000);
      }, randomDelay * 1000);
    }
  }

  sendMessage(event?: any): void {
    if (event) {
      event.preventDefault();
    }

    if (this.hasCustomOrders) this.ns.showMessage("Only personell with customorders are allowed to send messages", false);
    
    if ((!this.messageText.trim() && !this.selectedImage) || !this.currentUser) {
      return;
    }

    if (this.isEditing && this.editingMessageId) {
      this.updateMessage();
      return;
    }

    const newMessage: Partial<Messages> = {
      SenderId: this.currentUser.UserId,
      ReceiverId: this.receiverId,
      Message: this.messageText.trim(),
      DateCreated: new Date().toISOString()
    };

    this.sendMessageToServer(newMessage);
  }

  private sendMessageToServer(message: Partial<Messages>): void {
    this.messageService.sendMessage(message).subscribe({
      next: (response) => {
        if(response.success) {
          this.loadMessages();
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    })
  }

  updateMessage(): void {
    if (!this.messageText.trim() || !this.editingMessageId) {
      return;
    }

    const updatedMessage = {
      MessagesId: this.editingMessageId,
      Message: this.messageText.trim()
    };

    
    this.messageService.updateMessage(updatedMessage.MessagesId, updatedMessage.Message).subscribe({
      next: () => {
        // Update message in local array
        const index = this.messages.findIndex(m => m.MessagesId === this.editingMessageId);
        if (index !== -1) {
          this.messages[index].Message = this.messageText.trim();
        }
        this.loadMessages();
        // Reset editing state
        this.resetMessageInput();
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
  }

  resetMessageInput(): void {
    this.messageText = '';
    this.isEditing = false;
    this.editingMessageId = '';
    this.selectedImage = null;
    this.selectedImagePreview = '';
    this.showEmojiPicker = false;
    
    // Reset textarea height
    if (this.messageInput) {
      this.messageInput.nativeElement.style.height = 'auto';
    }
  }

  editMessage(message: Messages): void {
    this.isEditing = true;
    this.editingMessageId = message.MessagesId;
    this.messageText = this.stripImageTags(message.Message);
    
    // Focus on input
    setTimeout(() => {
      this.messageInput.nativeElement.focus();
    }, 100);
  }

  cancelEdit(): void {
    this.resetMessageInput();
  }

  // Check if message can be updated (within 1 hour and is from current user)
  canUpdateMessage(message: Messages): boolean {
    if (message.SenderId !== this.currentUser.UserId) {
      return false;
    }
    
    const messageDate = new Date(message.DateCreated);
    const now = new Date();
    const hourInMs = 60 * 60 * 1000;
    
    return (now.getTime() - messageDate.getTime()) < hourInMs;
  }

  // File handling methods
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length > 0) {
      this.selectedImage = files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeSelectedImage(): void {
    this.selectedImage = null;
    this.selectedImagePreview = '';
    this.fileInput.nativeElement.value = '';
  }

  // Upload image to server and return URL
  // private async uploadImage(): Promise<string> {
  //   if (!this.selectedImage) {
  //     return '';
  //   }

  //   try {
  //     const imageUrl = await this.messageService.uploadImage(this.selectedImage).toPromise();
  //     return imageUrl || '';
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     return '';
  //   } finally {
  //     this.removeSelectedImage();
  //   }
  // }

  // Emoji picker methods
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  selectEmojiCategory(category: string): void {
    this.currentEmojiCategory = category;
    this.filteredEmojis = this.emojis[category as keyof typeof this.emojis];
  }

  addEmoji(emoji: string): void {
    this.messageText += emoji;
    // Don't close emoji picker after selection to allow multiple selections
  }

  // Helper methods
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    
    // If today, just show time
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within the last 7 days, show day and time
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `${date.toLocaleDateString([], { weekday: 'short' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show full date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatMessage(message: string): string {
    // Handle line breaks
    let formattedMessage = message.replace(/\n/g, '<br>');
    
    // Remove image tags for display in message text
    formattedMessage = this.stripImageTags(formattedMessage);
    
    // Add emoji parsing if needed
    
    return formattedMessage;
  }

  stripImageTags(message: string): string {
    return message.replace(/<img[^>]*>/g, '');
  }

  hasImage(message: string): boolean {
    return /<img[^>]*>/g.test(message);
  }

  extractImageUrl(message: string): string {
    const imgMatch = message.match(/<img src="([^"]+)"/);
    return imgMatch ? imgMatch[1] : '';
  }

  viewImage(imageUrl: string): void {
    // Implement image viewer functionality
    // Could open in modal or lightbox
    window.open(imageUrl, '_blank');
  }

  scrollToBottom(): void {
    if (this.chatBodyRef) {
      this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
    }
  }

  autoGrow(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  }

  goBack(): void {
    history.back();
  }
}