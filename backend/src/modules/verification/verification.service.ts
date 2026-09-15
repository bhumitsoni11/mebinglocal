import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { VerificationStatus, User } from '@prisma/client';

export interface SubmitVerificationDto {
  idDocType?: string;
  idDocUrl?: string;
  residentDocType?: string;
  residentDocUrl?: string;
  bio?: string;
  city?: string;
  country?: string;
  languages?: string[];
  interests?: string[];
  hourlyRate?: number;
}

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async submitApplication(user: User, dto: SubmitVerificationDto) {
    // 1. Ensure local profile exists
    const localProfile = await this.prisma.localProfile.upsert({
      where: { userId: user.id },
      update: {
        city: dto.city,
        country: dto.country,
        bio: dto.bio,
        languages: dto.languages,
        interests: dto.interests,
        hourlyRate: dto.hourlyRate,
        verificationStatus: VerificationStatus.SUBMITTED,
      },
      create: {
        userId: user.id,
        city: dto.city || 'Florence',
        country: dto.country || 'Italy',
        bio: dto.bio || '',
        languages: dto.languages || ['English'],
        interests: dto.interests || ['Culture'],
        hourlyRate: dto.hourlyRate || 35.00,
        verificationStatus: VerificationStatus.SUBMITTED,
      },
    });

    // 2. Perform Automated Checks
    const automatedChecks = {
      hasIdDoc: Boolean(dto.idDocUrl),
      hasResidentDoc: Boolean(dto.residentDocUrl),
      profileCompletenessPct: dto.bio && dto.languages?.length ? 100 : 70,
      riskScore: 0.05,
      flags: [],
      timestamp: new Date().toISOString(),
    };

    // 3. Upsert Verification Application
    const application = await this.prisma.verificationApplication.upsert({
      where: { localProfileId: localProfile.id },
      update: {
        status: VerificationStatus.SUBMITTED,
        idDocType: dto.idDocType || 'Passport',
        residentDocType: dto.residentDocType || 'Utility Bill',
        automatedChecks,
        riskScore: 0.05,
        submittedAt: new Date(),
      },
      create: {
        localProfileId: localProfile.id,
        status: VerificationStatus.SUBMITTED,
        idDocType: dto.idDocType || 'Passport',
        residentDocType: dto.residentDocType || 'Utility Bill',
        automatedChecks,
        riskScore: 0.05,
      },
    });

    // 4. Save documents if provided
    if (dto.idDocUrl) {
      await this.prisma.verificationDocument.create({
        data: {
          applicationId: application.id,
          documentType: dto.idDocType || 'IDENTITY_GOV_ID',
          fileUrl: dto.idDocUrl,
        },
      });
    }

    if (dto.residentDocUrl) {
      await this.prisma.verificationDocument.create({
        data: {
          applicationId: application.id,
          documentType: dto.residentDocType || 'PROOF_OF_RESIDENCE',
          fileUrl: dto.residentDocUrl,
        },
      });
    }

    return {
      success: true,
      status: VerificationStatus.SUBMITTED,
      application,
    };
  }

  async getMyApplication(user: User) {
    const localProfile = await this.prisma.localProfile.findUnique({
      where: { userId: user.id },
      include: {
        verificationApplication: {
          include: { documents: true },
        },
      },
    });

    return localProfile?.verificationApplication || null;
  }
}
