import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc,
    Timestamp,
    addDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { AppError } from '@/utils/errorHandling';
import { FIRESTORE_COLLECTIONS } from '@/config/firestore.collections';

export interface Report {
    id: string;
    type: 'post' | 'comment' | 'user' | 'community';
    reason: string;
    description: string;
    reportedBy: {
        id: string;
        displayName: string;
        email: string;
    };
    reportedContent: {
        id: string;
        title?: string;
        content?: string;
        author?: {
            id: string;
            displayName: string;
        };
    };
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    createdAt: string;
    resolvedAt?: string;
    resolvedBy?: {
        id: string;
        displayName: string;
    };
}

export class ReportsService {
    /**
     * Get all reports
     * @returns Promise<Report[]>
     */
    static async getAllReports(): Promise<Report[]> {
        try {
            const reportsQuery = query(
                collection(db, FIRESTORE_COLLECTIONS.REPORTS),
                orderBy('createdAt', 'desc')
            );
            const reportsSnapshot = await getDocs(reportsQuery);

            return reportsSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
                    resolvedAt: data.resolvedAt?.toDate?.().toISOString(),
                } as Report;
            });
        } catch (error) {
            throw new AppError(
                500,
                error instanceof Error ? error.message : 'Failed to fetch reports'
            );
        }
    }

    /**
     * Update report status
     * @param reportId - Report ID
     * @param status - New status
     * @param resolvedBy - Admin who resolved the report
     * @returns Promise<void>
     */
    static async updateReportStatus(
        reportId: string,
        status: Report['status'],
        resolvedBy?: { id: string; displayName: string }
    ): Promise<void> {
        try {
            const reportRef = doc(db, FIRESTORE_COLLECTIONS.REPORTS, reportId);
            const updateData: any = {
                status,
                updatedAt: Timestamp.now(),
            };

            if (status === 'resolved' || status === 'dismissed') {
                updateData.resolvedAt = Timestamp.now();
                if (resolvedBy) {
                    updateData.resolvedBy = resolvedBy;
                }
            }

            await updateDoc(reportRef, updateData);
        } catch (error) {
            throw new AppError(
                500,
                error instanceof Error ? error.message : 'Failed to update report status'
            );
        }
    }

    /**
     * Create a new report (for testing/seeding)
     * @param reportData - Report data
     * @returns Promise<string>
     */
    static async createReport(reportData: Omit<Report, 'id' | 'createdAt'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.REPORTS), {
                ...reportData,
                createdAt: Timestamp.now(),
                status: 'pending',
            });
            return docRef.id;
        } catch (error) {
            throw new AppError(
                500,
                error instanceof Error ? error.message : 'Failed to create report'
            );
        }
    }
}
