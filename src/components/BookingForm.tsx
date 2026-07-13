'use client'

import { useState, useEffect, useCallback } from 'react'

interface Slot {
  time: string
  available: boolean
  remaining: number
}

interface AvailabilityResponse {
  date: string
  guests: number
  isOpen: boolean
  slots: Slot[]
  message?: string
}

interface BookingResponse {
  success: boolean
  bookingId: number
  table: string
  datetime: string
  guests: number
  message: string
  error?: string
}

const translations = {
  en: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    date: 'Date',
    time: 'Time',
    guests: 'Guests',
    dietary: 'Dietary preferences or restrictions',
    dietaryPlaceholder: 'e.g. vegetarian, lactose intolerant...',
    book: 'Confirm Reservation',
    selectTime: 'Select a time',
    checking: 'Checking availability...',
    closed: 'The restaurant is closed on this day.',
    noSlots: 'No tables available for this date and party size.',
    booking: 'Booking your table...',
    confirmed: 'Reservation confirmed!',
    confirmMsg: 'We look forward to welcoming you.',
    error: 'Something went wrong. Please try again.',
    tryAnother: 'Try another time',
    bookAnother: 'Book another table',
    guest: 'guest',
    guestsLabel: 'guests',
    available: 'available',
    full: 'full',
  },
  fr: {
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    date: 'Date',
    time: 'Heure',
    guests: 'Convives',
    dietary: 'Préférences ou restrictions alimentaires',
    dietaryPlaceholder: 'par ex. végétarien, intolérant au lactose...',
    book: 'Confirmer la réservation',
    selectTime: 'Choisir une heure',
    checking: 'Vérification de la disponibilité...',
    closed: 'Le restaurant est fermé ce jour-là.',
    noSlots: 'Aucune table disponible pour cette date et ce nombre de convives.',
    booking: 'Réservation en cours...',
    confirmed: 'Réservation confirmée !',
    confirmMsg: 'Nous avons hâte de vous accueillir.',
    error: 'Une erreur est survenue. Veuillez réessayer.',
    tryAnother: 'Essayer un autre horaire',
    bookAnother: 'Réserver une autre table',
    guest: 'convive',
    guestsLabel: 'convives',
    available: 'disponible',
    full: 'complet',
  },
  nl: {
    name: 'Naam',
    email: 'E-mail',
    phone: 'Telefoon',
    date: 'Datum',
    time: 'Tijd',
    guests: 'Gasten',
    dietary: 'Dieetvoorkeuren of beperkingen',
    dietaryPlaceholder: 'bijv. vegetarisch, lactose-intolerant...',
    book: 'Reservering bevestigen',
    selectTime: 'Kies een tijd',
    checking: 'Beschikbaarheid controleren...',
    closed: 'Het restaurant is gesloten op deze dag.',
    noSlots: 'Geen tafels beschikbaar voor deze datum en groepsgrootte.',
    booking: 'Uw tafel wordt geboekt...',
    confirmed: 'Reservering bevestigd!',
    confirmMsg: 'We kijken ernaar uit u te verwelkomen.',
    error: 'Er is iets misgegaan. Probeer het opnieuw.',
    tryAnother: 'Probeer een andere tijd',
    bookAnother: 'Boek een andere tafel',
    guest: 'gast',
    guestsLabel: 'gasten',
    available: 'beschikbaar',
    full: 'vol',
  },
}

type Lang = 'en' | 'fr' | 'nl'

export default function BookingForm({ lang }: { lang: Lang }) {
  const t = translations[lang] || translations.en

  // Form state
  const [guests, setGuests] = useState(2)
  const [date, setDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dietary, setDietary] = useState('')

  // UI state
  const [step, setStep] = useState<'select' | 'details' | 'confirming' | 'confirmed' | 'error'>('select')
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [closedMessage, setClosedMessage] = useState('')
  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Min date: today
  const today = new Date().toISOString().split('T')[0]

  // Max date: 45 days from now
  const maxDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Fetch availability when date or guests change
  const fetchAvailability = useCallback(async () => {
    if (!date) return

    setLoading(true)
    setSelectedTime('')

    try {
      const res = await fetch(`/api/odoo/availability?date=${date}&guests=${guests}`)
      const data: AvailabilityResponse = await res.json()

      setIsOpen(data.isOpen)
      setSlots(data.slots)
      setClosedMessage(data.message || '')
    } catch {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [date, guests])

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  // Handle booking submission
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTime || !name || !email || !phone) return

    setStep('confirming')

    try {
      const res = await fetch('/api/odoo/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time: selectedTime,
          guests,
          name,
          email,
          phone,
          dietary: dietary || undefined,
        }),
      })

      const data: BookingResponse = await res.json()

      if (data.success) {
        setBooking(data)
        setStep('confirmed')
      } else {
        setErrorMsg(data.error || t.error)
        setStep('error')
      }
    } catch {
      setErrorMsg(t.error)
      setStep('error')
    }
  }

  const resetForm = () => {
    setStep('select')
    setSelectedTime('')
    setName('')
    setEmail('')
    setPhone('')
    setDietary('')
    setBooking(null)
    setErrorMsg('')
  }

  // Confirmed state
  if (step === 'confirmed' && booking) {
    return (
      <div className="booking-confirmed">
        <div className="booking-confirmed__icon">✓</div>
        <h2 className="booking-confirmed__title">{t.confirmed}</h2>
        <p className="booking-confirmed__message">{t.confirmMsg}</p>
        <div className="booking-confirmed__details">
          <div className="booking-detail">
            <span className="booking-detail__label">{t.date}</span>
            <span className="booking-detail__value">
              {new Date(booking.datetime).toLocaleDateString(lang === 'fr' ? 'fr-BE' : lang === 'nl' ? 'nl-BE' : 'en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
          <div className="booking-detail">
            <span className="booking-detail__label">{t.time}</span>
            <span className="booking-detail__value">{selectedTime}</span>
          </div>
          <div className="booking-detail">
            <span className="booking-detail__label">{t.guests}</span>
            <span className="booking-detail__value">{booking.guests} {booking.guests === 1 ? t.guest : t.guestsLabel}</span>
          </div>
          <div className="booking-detail">
            <span className="booking-detail__label">{t.name}</span>
            <span className="booking-detail__value">{name}</span>
          </div>
        </div>
        <button type="button" className="btn btn--outline" onClick={resetForm}>
          {t.bookAnother}
        </button>
      </div>
    )
  }

  // Confirming state
  if (step === 'confirming') {
    return (
      <div className="booking-loading">
        <div className="booking-loading__spinner" />
        <p>{t.booking}</p>
      </div>
    )
  }

  // Error state
  if (step === 'error') {
    return (
      <div className="booking-error">
        <p>{errorMsg}</p>
        <button type="button" className="btn btn--outline" onClick={resetForm}>
          {t.tryAnother}
        </button>
      </div>
    )
  }

  const hasAvailable = slots.some(s => s.available)

  return (
    <form className="reservation-form" onSubmit={handleBook}>
      {/* Step 1: Date, Guests, Time Selection */}
      <div className="form-row">
        <label className="form-field">
          <span className="form-field__label">{t.date}</span>
          <input
            type="date"
            value={date}
            min={today}
            max={maxDate}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-field__input"
          />
        </label>
        <label className="form-field">
          <span className="form-field__label">{t.guests}</span>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            required
            className="form-field__input"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? t.guest : t.guestsLabel}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Time Slots */}
      {date && (
        <div className="time-slots">
          <span className="form-field__label">{t.time}</span>
          {loading ? (
            <p className="time-slots__loading">{t.checking}</p>
          ) : !isOpen ? (
            <p className="time-slots__closed">{closedMessage || t.closed}</p>
          ) : !hasAvailable ? (
            <p className="time-slots__closed">{t.noSlots}</p>
          ) : (
            <div className="time-slots__grid">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`time-slot ${selectedTime === slot.time ? 'time-slot--selected' : ''} ${!slot.available ? 'time-slot--unavailable' : ''}`}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  aria-label={`${slot.time} — ${slot.available ? t.available : t.full}`}
                >
                  <span className="time-slot__time">{slot.time}</span>
                  {!slot.available && <span className="time-slot__tag">{t.full}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Guest Details (shown after time selection) */}
      {selectedTime && (
        <div className="guest-details">
          <div className="form-row">
            <label className="form-field">
              <span className="form-field__label">{t.name}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-field__input"
                autoComplete="name"
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">{t.phone}</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="form-field__input"
                autoComplete="tel"
              />
            </label>
          </div>
          <label className="form-field">
            <span className="form-field__label">{t.email}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-field__input"
              autoComplete="email"
            />
          </label>
          <label className="form-field">
            <span className="form-field__label">{t.dietary}</span>
            <textarea
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              rows={2}
              className="form-field__input"
              placeholder={t.dietaryPlaceholder}
            />
          </label>

          <button type="submit" className="btn" data-magnetic>
            {t.book}
          </button>
        </div>
      )}
    </form>
  )
}
