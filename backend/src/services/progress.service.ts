import { PrismaClient } from "@prisma/client";
import { Progress } from "../interfaces/backend.interfaces";
import { ProgressInterface } from "../interfaces/services.coupling.interfaces";
import { v4 } from "uuid";

export class ProgressService implements ProgressInterface {
  prisma = new PrismaClient({
    log: ["error"]
  });
  
  public async createProgress(UserId: string, CustomOrderId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to continue with the order.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let customOrderExists = await this.prisma.customOrder.findUnique({
      where: {
        CustomOrderId,
        UserId: userExists.UserId
      }
    });

    if (customOrderExists == null) {
      return {
        'success': false,
        'error': 'Order specified not found.'
      }
    }

    let createProgress = await this.prisma.progress.create({
      data: {
        ProgressId: v4(),
        ProductId: customOrderExists.ProductId,
        UserId: customOrderExists.UserId,
        CustomOrderId: customOrderExists.CustomOrderId,
        MaterialsImages: '',
        ProgressImages: '',
        FinalImages: ''
      }
    });

    if (createProgress == null) {
      return {
        'success': false,
        'error': 'Unable to continue with the progress.'
      }
    } else {
      return {
        'success': true
      }
    }
  }
  public async updateProgress(userId: string, progressId: string, progress: Progress): Promise<{ success: boolean; error?: string; message?: string; }> {
    
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId: userId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to update the order.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let progressExists = await this.prisma.progress.findUnique({
      where: {
        ProgressId: progressId,
        UserId: userExists.UserId
      }
    });

    if (progressExists == null) {
      return {
        'success': false,
        'error': 'Progress specified not found.'
      }
    }

    let { ProductId, ProgressId, UserId, CustomOrderId, DateCreated, Status, DateCompleted, Product, User, CustomOrder, ...r_progress } = progress;

    let updateProgress = await this.prisma.progress.update({
      data: {
        ProgressId: progressExists.ProgressId,
        ProductId: progressExists.ProductId,
        UserId: progressExists.UserId,
        CustomOrderId: progressExists.CustomOrderId,
        ...r_progress
      },
      where: {
        ProgressId: progressExists.ProgressId,
        UserId: progressExists.UserId
      }
    });

    if (updateProgress == null) {
      return {
        'success': false,
        'error': 'Unable to update progress.'
      }
    } else {
      return {
        'success': true,
        'message': 'Images updated successfully.'
      }
    }
  }
  public async updateProgressStatus(UserId: string, ProgressId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to update the order.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let progressExists = await this.prisma.progress.findUnique({
      where: {
        ProgressId,
        UserId: userExists.UserId
      }
    });

    if (progressExists == null) {
      return {
        'success': false,
        'error': 'Progress specified not found.'
      }
    }

    let updateProgressStatus = await this.prisma.progress.update({
      data: {
        Status: 'complete'
      },
      where: {
        ProgressId: progressExists.ProgressId
      }
    });

    if (updateProgressStatus) {
      return {
        'success': true
      }
    } else {
      return {
        'success': false
      }
    }
  }
  public async approveProgress(UserId: string, ProgressId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to approve the progress.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let progressExists = await this.prisma.progress.findUnique({
      where: {
        ProgressId
      }
    });

    if (progressExists == null) {
      return {
        'success': false,
        'error': 'Progress specified not found.'
      }
    }

    let approveProgress = await this.prisma.progress.update({
      data: {
        IsApproved: true
      },
      where: {
        ProgressId: progressExists.ProgressId
      }
    });

    if (approveProgress) {
      return {
        'success': true,
        'message': 'Progress approved successfully.'
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to approve progress.'
      }
    }
  }
  public async deleteProgress(UserId: string, ProgressId: string): Promise<{ success: boolean; error?: string; message?: string; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId,
        Role: 'admin'
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Admin required for this action.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let progressExists = await this.prisma.progress.findUnique({
      where: {
        ProgressId
      }
    });

    if (progressExists == null) {
      return {
        'success': false,
        'error': 'Progress specified not found.'
      }
    }

    let deleteProgress = await this.prisma.progress.delete({
      where: {
        ProgressId: progressExists.ProgressId
      }
    });

    if (deleteProgress) {
      return {
        'success': true,
        'message': 'Progress successfully deleted.'
      }
    } else {
      return {
        'success': false,
        'error': 'Unable to delete progress.'
      }
    }
  }
  public async getAllProgresses(): Promise<{ success: boolean; error?: string; message?: string; progresses?: Progress[] | unknown[]; }> {
    let getAllProgresses = await this.prisma.progress.findMany({
      include: {
        Product: true,
        User: true,
        CustomOrder: true
      }
    });

    if (getAllProgresses.length < 1) {
      return {
        'success': false,
        'error': 'No progresses currently available.'
      }
    } else {
      return {
        'success': true,
        'message': 'Progress fetched successfully.',
        'progresses': getAllProgresses
      }
    }
  }

  public async getCompletedProgresses(): Promise<{ success: boolean, error?: string, message?: string, progresses?: Progress[] | unknown[] }> {
    let completedProgress = await this.prisma.progress.findMany({
      where: {
        Status: 'completed'
      },
      include: {
        Product: true,
        User: true,
        CustomOrder: true
      }
    });

    if (completedProgress.length < 1) {
      return {
        'success': false,
        'error': 'No progresses currently available.'
      }
    } else {
      return {
        'success': true,
        'message': 'Progress fetched successfully.',
        'progresses': completedProgress
      }
    }
  }
  public async getProgressesByUserId(UserId: string): Promise<{ success: boolean; error?: string; message?: string; progresses?: Progress[] | unknown[]; }> {
    let userExists = await this.prisma.user.findUnique({
      where: {
        UserId
      }
    });

    if (userExists == null) {
      return {
        'success': false,
        'error': 'Login inorder to access furniture progress.'
      }
    }

    if (userExists.IsDeleted) {
      return {
        'success': false,
        'error': `${userExists.Fullname}, your account is inactive.`
      }
    }

    let getAllProgresses = await this.prisma.progress.findMany({
      where: {
        UserId: userExists.UserId
      },
      include: {
        Product: true,
        User: true,
        CustomOrder: true
      }
    });

    if (getAllProgresses.length < 1) {
      return {
        'success': false,
        'error': 'No progresses currently available.'
      }
    } else {
      return {
        'success': true,
        'message': 'Progress fetched successfully.',
        'progresses': getAllProgresses
      }
    }
  }
  
}