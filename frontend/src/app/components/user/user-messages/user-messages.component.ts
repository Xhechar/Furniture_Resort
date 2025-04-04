import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Messages, Product, User } from '../../../interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-messages.component.html',
  styleUrl: './user-messages.component.css'
})
export class UserMessagesComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBody') chatBodyRef!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  currentUser: User;
  selectedProduct: Product | null = null;
  messages: Messages[] = [];
  messageText: string = '';
  isAdminTyping: boolean = false;
  
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
  
  // Sample emoji data - in a real app, you'd use a more comprehensive library
  emojis = {
    smileys: ['😀', '😁', '😂', '🙂', '😊', '😇', '🥰', '😍', '😘', '😋', '😎', '🤩', '😏', '😣', '😮', '🤔'],
    objects: ['💼', '📱', '💻', '⌚', '📷', '🎮', '🎧', '💎', '🔑', '🛒', '🎁', '📚', '✏️', '📌', '🔍', '💡'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🦄'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🥝', '🍍', '🥭', '🍕', '🍔', '🍟', '🍦', '🍫'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '✈️', '🚀', '🛸', '🚲', '⛵', '🚢', '🚆'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '🔴']
  };
  filteredEmojis: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize with dummy user data - in a real app, you'd get this from a service
    this.currentUser = {
      UserId: 'user123',
      Fullname: 'John Doe',
      Email: 'john@example.com',
      Mobile: '123456789',
      Country: 'Kenya',
      City: 'Nairobi',
      Gender: 'Male',
      IdentificationNumber: 12345,
      ProfileImage: 'assets/user-avatar.png',
      BackgroundWallpaper: '',
      Password: '',
      IsWelcomed: true,
      IsDeleted: false,
      DateCreated: new Date(),
      HasOrder: false,
      HasWishList: false,
      Role: 'user',
      Selected: false
    };
    
    this.filteredEmojis = this.emojis.smileys;
  }

  ngOnInit(): void {
    // Get product ID from route params
    this.route.params.subscribe(params => {
      const productId = params['productId'];
      if (productId) {
        this.loadProductDetails(productId);
      }
    });
    
    // Load chat history
    this.loadChatHistory();
    
    // Simulate admin typing after 2 seconds
    setTimeout(() => {
      this.simulateAdminTyping();
    }, 2000);
  }
  
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  
  loadProductDetails(productId: string): void {
    // In a real app, you'd get this from a service
    this.selectedProduct = {
      ProductId: productId,
      ProductName: 'Handcrafted Leather Bag',
      ProductImages: 'assets/product-1.jpg,assets/product-1-alt.jpg',
      ShortDesc: 'Genuine leather handcrafted bag',
      LongDesc: 'This beautiful handcrafted leather bag is made from the finest materials. Perfect for everyday use.',
      Sizes: 'S,M,L',
      Category: 'Bags',
      Colour: 'Brown',
      Prize: 5999,
      StockQuantity: 10,
      StockLimit: 5,
      CustomPrize: 6999,
      OnOffer: true,
      OnFlushSale: false,
      Discount: 10,
      MakePeriods: 14,
      Deposit: 2000,
      DateCreated: new Date(),
      IsActivated: true,
      IsCustommable: true
    };
  }
  
  loadChatHistory(): void {
    // In a real app, you'd get this from a service
    // Leaving empty for now
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ', ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/user']);
  }
  
  openFileSelector(): void {
    this.fileInput.nativeElement.click();
  }
  
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }
  
  removeSelectedImage(): void {
    this.selectedImage = null;
    this.selectedImagePreview = '';
  }
  
  toggleEmojiPicker(): void {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  
  selectEmojiCategory(category: string): void {
    this.currentEmojiCategory = category;
    this.filteredEmojis = this.emojis[category as keyof typeof this.emojis];
  }
  
  addEmoji(emoji: string): void {
    this.messageText += emoji;
    this.showEmojiPicker = false;
    this.messageInput.nativeElement.focus();
  }
  
  sendMessage(event?: KeyboardEvent): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.messageText.trim() === '' && !this.selectedImage) {
      return;
    }
    
    // Prepare message text
    let messageContent = this.messageText.trim();
    
    // If there's an image, add it to the message
    if (this.selectedImage) {
      // In a real app, you'd upload the image to your server and get a URL
      // For this demo, we'll use the preview as if it were the uploaded URL
      messageContent += `<img src="${this.selectedImagePreview}" alt="Uploaded image">`;
    }
    
    // Create a new message object
    const newMessage: Messages = {
      MessagesId: 'msg_' + Date.now(),
      SenderId: this.currentUser.UserId,
      ReceiverId: 'admin', // Assuming admin has a fixed ID
      Message: messageContent,
      DateCreated: new Date().toISOString(),
      Sender: this.currentUser,
      Receiver: {
        UserId: 'admin',
        Fullname: 'Admin',
        Email: 'admin@ndaganisf.com',
        Mobile: '',
        Country: '',
        City: '',
        Gender: '',
        IdentificationNumber: 0,
        ProfileImage: 'assets/admin-avatar.png',
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date(),
        HasOrder: false,
        HasWishList: false,
        Role: 'admin',
        Selected: false
      }
    };
    
    // Add message to chat
    this.messages.push(newMessage);
    
    // Clear input fields
    this.messageText = '';
    this.removeSelectedImage();
    
    // Simulate admin typing after a short delay
    setTimeout(() => {
      this.simulateAdminTyping();
    }, 1500);
  }
  
  simulateAdminTyping(): void {
    this.isAdminTyping = true;
    
    // Simulate admin response after 2 seconds
    setTimeout(() => {
      this.isAdminTyping = false;
      
      // Add admin response
      const adminResponse: Messages = {
        MessagesId: 'msg_' + Date.now(),
        SenderId: 'admin',
        ReceiverId: this.currentUser.UserId,
        Message: this.getRandomAdminResponse(),
        DateCreated: new Date().toISOString(),
        Sender: {
          UserId: 'admin',
          Fullname: 'Admin',
          Email: 'admin@ndaganisf.com',
          Mobile: '',
          Country: '',
          City: '',
          Gender: '',
          IdentificationNumber: 0,
          ProfileImage: 'assets/admin-avatar.png',
          BackgroundWallpaper: '',
          Password: '',
          IsWelcomed: true,
          IsDeleted: false,
          DateCreated: new Date(),
          HasOrder: false,
          HasWishList: false,
          Role: 'admin',
          Selected: false
        },
        Receiver: this.currentUser
      };
      
      this.messages.push(adminResponse);
    }, 2000);
  }
  
  getRandomAdminResponse(): string {
    const responses = [
      "Thank you for your message. How can I help you with this product?",
      "Hello! I'm happy to assist you with any questions about this item.",
      "Thanks for reaching out! Is there anything specific you'd like to know about the customization options?",
      "I appreciate your interest in our products. Let me know if you need any details about shipping or delivery.",
      "Hello there! Would you like to know more about the materials used in this product?",
      "Thank you for contacting Ndagani SF support. I'm here to help with any questions you might have."
    ];
    
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

  formatMessage(message: string): string {
    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.replace(urlRegex, (url) => {
      // Don't process image tags
      if (message.includes('<img') && url.includes('src=')) {
        return url;
      }
      return `<a href="${url}" target="_blank" class="message-link">${url}</a>`;
    });
  }
  
  hasImage(message: string): boolean {
    return message.includes('<img');
  }
  
  extractImageUrl(message: string): string {
    // Extract the image URL from the message
    const imgMatch = message.match(/src="([^"]+)"/);
    return imgMatch ? imgMatch[1] : '';
  }
  
  viewImage(imageUrl: string): void {
    // Open image in a modal or lightbox
    // In a real app, you'd implement a proper image viewer
    window.open(imageUrl, '_blank');
  }
  
  scrollToBottom(): void {
    try {
      this.chatBodyRef.nativeElement.scrollTop = this.chatBodyRef.nativeElement.scrollHeight;
    } catch (err) { }
  }
  
  autoGrow(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  }
  
  // Additional methods for a complete implementation
  
  searchMessages(query: string): void {
    // Implement search functionality
    if (!query.trim()) {
      this.loadChatHistory();
      return;
    }
    
    // Filter messages based on query
    // In a real app, you might do this on the server
    const filteredMessages = this.messages.filter(msg => 
      msg.Message.toLowerCase().includes(query.toLowerCase())
    );
    
    this.messages = filteredMessages;
  }
  
  downloadChat(): void {
    // Generate a text file with the chat history
    let chatText = 'Ndagani SF Support Chat\n';
    chatText += `Product: ${this.selectedProduct?.ProductName}\n`;
    chatText += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    this.messages.forEach(msg => {
      const sender = msg.SenderId === this.currentUser.UserId ? 'You' : 'Admin';
      const time = this.formatDate(msg.DateCreated);
      // Strip HTML tags for plain text
      const plainMessage = msg.Message.replace(/<[^>]*>?/gm, '');
      
      chatText += `[${time}] ${sender}: ${plainMessage}\n`;
    });
    
    // Create download link
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(chatText));
    element.setAttribute('download', `ndagani-chat-${new Date().getTime()}.txt`);
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
  }
  
  markAsUrgent(): void {
    // Implementation for marking a conversation as urgent
    // In a real app, you'd call a service to update the conversation status
    alert('This conversation has been marked as urgent. Our team will respond promptly.');
  }
  
  reportIssue(): void {
    // Implementation for reporting an issue with the conversation
    // In a real app, you'd show a modal with options
    alert('Thank you for reporting this issue. Our team will review this conversation.');
  }
  
  isTyping(): void {
    // Send typing indicator to server
    // In a real app, you'd use a service to notify that the user is typing
    console.log('User is typing...');
  }
  
  // Utility methods for emoji handling
  
  searchEmojis(query: string): void {
    if (!query.trim()) {
      this.filteredEmojis = this.emojis[this.currentEmojiCategory as keyof typeof this.emojis];
      return;
    }
    
    // Search across all emoji categories
    const results: string[] = [];
    
    Object.values(this.emojis).forEach(categoryEmojis => {
      categoryEmojis.forEach(emoji => {
        // Simple search - in a real app, you'd use emoji descriptions
        if (emoji.includes(query)) {
          results.push(emoji);
        }
      });
    });
    
    this.filteredEmojis = results;
  }
  
  // Lifecycle hooks
  
  ngOnDestroy(): void {
    // Clean up any subscriptions or timers
    // In a real app, you'd unsubscribe from observables
  }
}
