'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Doctor {
  id: string
  specialization: string
  slotDuration: number
  bio: string | null
  phone: string | null
  user: {
    id: string
    name: string
    email: string
  }
  _count: {
    appointments: number
  }
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: 'General Physician',
    slotDuration: 30,
    bio: '',
    phone: '',
  })
  const [tempPassword, setTempPassword] = useState('')
  const [error, setError] = useState('')

  const fetchDoctors = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/doctors')
      const data = await res.json()
      setDoctors(data.data || [])
    } catch {
      setError('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }
      setTempPassword(data.data.tempPassword)
      fetchDoctors()
    } catch {
      setError('Failed to create doctor')
    }
  }

  const handleUpdateDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDoctor) return
    setError('')
    try {
      const res = await fetch(`/api/admin/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          specialization: formData.specialization,
          slotDuration: Number(formData.slotDuration),
          bio: formData.bio,
          phone: formData.phone,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }
      setEditingDoctor(null)
      fetchDoctors()
    } catch {
      setError('Failed to update doctor')
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    try {
      const res = await fetch(`/api/admin/doctors/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message)
        return
      }
      fetchDoctors()
    } catch {
      alert('Failed to delete doctor')
    }
  }

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.user.name,
      email: doctor.user.email,
      specialization: doctor.specialization,
      slotDuration: doctor.slotDuration,
      bio: doctor.bio || '',
      phone: doctor.phone || '',
    })
  }

  const openAddModal = () => {
    setEditingDoctor(null)
    setTempPassword('')
    setFormData({
      name: '',
      email: '',
      specialization: 'General Physician',
      slotDuration: 30,
      bio: '',
      phone: '',
    })
    setShowAddModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="text-sm font-semibold text-gray-500 hover:text-indigo-600">
            ← Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-bold text-gray-900">Manage Doctors</span>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          + Add New Doctor
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No doctors registered yet.</div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4">Specialization</th>
                  <th className="px-6 py-4">Slot Duration</th>
                  <th className="px-6 py-4">Appointments</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{doctor.user.name}</div>
                      <div className="text-xs text-gray-400">{doctor.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-4">{doctor.slotDuration} mins</td>
                    <td className="px-6 py-4">{doctor._count.appointments}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(doctor)}
                        className="text-xs text-indigo-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal for Add / Edit Doctor */}
      {(showAddModal || editingDoctor) && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
            </h2>

            {tempPassword && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm mb-4">
                <p className="font-semibold">Doctor Created Successfully!</p>
                <p className="mt-1 text-xs">Temporary Password: <code className="font-mono font-bold">{tempPassword}</code></p>
                <p className="text-xs text-green-600 mt-1">Please copy this password now.</p>
              </div>
            )}

            {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

            <form onSubmit={editingDoctor ? handleUpdateDoctor : handleCreateDoctor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {!editingDoctor && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Slot Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  value={formData.slotDuration}
                  onChange={(e) => setFormData({ ...formData, slotDuration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingDoctor(null)
                  }}
                  className="flex-1 border py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
                >
                  Close
                </button>
                {!tempPassword && (
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold"
                  >
                    {editingDoctor ? 'Save Changes' : 'Create Doctor'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
