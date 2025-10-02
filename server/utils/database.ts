import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://galvarez:71441137@clusterprojectsga.jfjrztz.mongodb.net/bd-notesapp?retryWrites=true&w=majority&appName=ClusterProjectsGA'

let isConnected = false

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Already connected to MongoDB')
    return
  }

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log('Connected to MongoDB Atlas')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}

export const disconnectFromDatabase = async () => {
  if (!isConnected) {
    return
  }

  try {
    await mongoose.disconnect()
    isConnected = false
    console.log('Disconnected from MongoDB')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
    throw error
  }
}