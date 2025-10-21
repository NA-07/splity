import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Group, GroupMember } from '@/types'

export async function createGroup(
  name: string,
  description: string,
  createdBy: string,
  creatorEmail: string,
  creatorName: string
): Promise<string> {
  try {
    const groupData = {
      name,
      description,
      createdBy,
      members: [
        {
          userId: createdBy,
          email: creatorEmail,
          displayName: creatorName,
          role: 'admin',
          joinedAt: serverTimestamp(),
        },
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    const docRef = await addDoc(collection(db, 'groups'), groupData)
    return docRef.id
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getGroup(groupId: string): Promise<Group | null> {
  try {
    const groupDoc = await getDoc(doc(db, 'groups', groupId))
    if (!groupDoc.exists()) return null

    const data = groupDoc.data()
    return {
      id: groupDoc.id,
      name: data.name,
      description: data.description,
      createdBy: data.createdBy,
      members: data.members.map((m: any) => ({
        ...m,
        joinedAt: m.joinedAt?.toDate() || new Date(),
      })),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getUserGroups(userId: string): Promise<Group[]> {
  try {
    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains-any', [
        { userId },
      ])
    )

    const snapshot = await getDocs(collection(db, 'groups'))
    const groups: Group[] = []

    snapshot.forEach((doc) => {
      const data = doc.data()
      const isMember = data.members.some((m: any) => m.userId === userId)
      if (isMember) {
        groups.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          createdBy: data.createdBy,
          members: data.members.map((m: any) => ({
            ...m,
            joinedAt: m.joinedAt?.toDate() || new Date(),
          })),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        })
      }
    })

    return groups
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function addGroupMember(
  groupId: string,
  member: Omit<GroupMember, 'joinedAt'>
): Promise<void> {
  try {
    const groupRef = doc(db, 'groups', groupId)
    const groupDoc = await getDoc(groupRef)

    if (!groupDoc.exists()) {
      throw new Error('Group not found')
    }

    const currentMembers = groupDoc.data().members || []
    const newMember = {
      ...member,
      joinedAt: serverTimestamp(),
    }

    await updateDoc(groupRef, {
      members: [...currentMembers, newMember],
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function removeGroupMember(
  groupId: string,
  userId: string
): Promise<void> {
  try {
    const groupRef = doc(db, 'groups', groupId)
    const groupDoc = await getDoc(groupRef)

    if (!groupDoc.exists()) {
      throw new Error('Group not found')
    }

    const currentMembers = groupDoc.data().members || []
    const updatedMembers = currentMembers.filter((m: any) => m.userId !== userId)

    await updateDoc(groupRef, {
      members: updatedMembers,
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Pick<Group, 'name' | 'description'>>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'groups', groupId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function deleteGroup(groupId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'groups', groupId))
  } catch (error: any) {
    throw new Error(error.message)
  }
}
