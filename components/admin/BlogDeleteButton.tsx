'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BlogDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('rh_blog').delete().eq('id', id)
    setDeleting(false)
    setShowModal(false)
    startTransition(() => router.refresh())
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-gray-600 hover:text-red-400 text-xs px-2.5 py-1.5 rounded bg-[#1a1a1a] hover:bg-[#222] transition-colors"
      >
        Delete
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-white font-condensed font-bold text-lg mb-2">Delete post?</h3>
            <p className="text-gray-400 text-sm mb-1"><span className="text-white">{title}</span></p>
            <p className="text-gray-600 text-xs mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-300 font-condensed px-4 py-2.5 rounded-lg hover:bg-[#222] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-condensed font-bold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
              >
                {deleting ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
