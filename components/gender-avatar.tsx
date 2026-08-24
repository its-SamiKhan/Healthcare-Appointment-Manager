import React from 'react'

export function isFemaleGender(name?: string, gender?: string): boolean {
  if (gender) {
    const g = gender.toLowerCase()
    if (g.includes('female') || g === 'f' || g.includes('woman') || g.includes('girl')) return true
    if (g.includes('male') || g === 'm' || g.includes('man') || g.includes('boy')) return false
  }
  if (!name) return false
  const n = name.toLowerCase()
  const femaleNames = [
    'ananya', 'priya', 'sunita', 'sarah', 'anjali', 'sneha', 'pooja', 'neha', 
    'kavita', 'swati', 'meena', 'rekha', 'divya', 'dr. ananya', 'dr. priya',
    'dr. sarah', 'mrs.', 'ms.', 'female', 'woman', 'dr. sneha', 'dr. anjali',
    'sharma ananya', 'gupta sunita'
  ]
  return femaleNames.some((f) => n.includes(f))
}

export interface GenderAvatarProps {
  name?: string
  gender?: string
  className?: string
  iconClassName?: string
}

export function GenderAvatar({
  name,
  gender,
  className = 'w-9 h-9',
  iconClassName = 'w-5 h-5',
}: GenderAvatarProps) {
  const female = isFemaleGender(name, gender)

  return (
    <div
      className={`rounded-full bg-white border border-teal-200/90 shadow-2xs flex items-center justify-center p-1.5 shrink-0 ${className}`}
      title={name ? `${name} (${female ? 'Female' : 'Male'})` : 'User Profile'}
    >
      {female ? (
        // Female Line-Art Silhouette (White background, single line stroke with sidebar teal #0f766e)
        <svg className={`text-[#0f766e] ${iconClassName}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="7.5" r="3" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7c-1 1.2-1.5 2.8-1.5 4.5 0 2.2 1.2 3.5 2.5 4M17 7c1 1.2 1.5 2.8 1.5 4.5 0 2.2-1.2 3.5-2.5 4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 20.5a6.5 6.5 0 0 1 13 0" />
        </svg>
      ) : (
        // Male Line-Art Silhouette (White background, single line stroke with sidebar teal #0f766e)
        <svg className={`text-[#0f766e] ${iconClassName}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="7.5" r="3.25" strokeLinecap="round" strokeLinejoin="round" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.75 20.25a7.25 7.25 0 0 1 14.5 0" />
        </svg>
      )}
    </div>
  )
}
