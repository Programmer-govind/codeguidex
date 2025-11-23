# ⚠️ Action Required: Create Firestore Index

You are seeing an error in the Admin Dashboard because Firebase requires a specific **Index** for the "Recent Activity" query.

## ❌ The Error
`AppError: The query requires a COLLECTION_GROUP_DESC index for collection posts and field createdAt.`

## ✅ The Solution (Click the Link!)

1.  **Open your Browser Console** (F12) where you saw the error.
2.  **Look for the long link** in the error message. It looks like:
    `https://console.firebase.google.com/v1/r/project/codeguidex-5e48d/firestore/indexes...`
3.  **Click that link**. It will take you directly to the Firebase Console.
4.  **Click "Create Index"**.
5.  **Wait 2-5 minutes** for the index to build.

## 🔄 After Index is Built
Refresh the Admin Dashboard. The "Recent Activity" section will start working!

---

## 🛠️ Other Fixes Applied
I have also fixed the **Redux Non-Serializable Value Error**.
- **Issue**: Firebase `Timestamp` objects were causing Redux to complain.
- **Fix**: I updated `ProfileService` to automatically convert all Timestamps to Strings before sending them to Redux.
