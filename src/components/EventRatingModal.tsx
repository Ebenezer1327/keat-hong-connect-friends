
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Camera, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface EventRatingModalProps {
  activityId: string;
  activityTitle: string;
  language: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EventRatingModal: React.FC<EventRatingModalProps> = ({
  activityId,
  activityTitle,
  language,
  onClose,
  onSuccess
}) => {
  const { profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const translations = {
    en: {
      rateEvent: 'Rate This Event',
      rating: 'Your Rating',
      comment: 'Your Comments',
      commentPlaceholder: 'Tell us what you thought about this event...',
      memory: 'Share a Memory',
      memoryPlaceholder: 'Share a special moment from this event...',
      photoUrl: 'Photo URL (optional)',
      photoPlaceholder: 'https://example.com/photo.jpg',
      submit: 'Submit Rating & Memory',
      cancel: 'Cancel',
      success: 'Thank you for your feedback!',
      error: 'Failed to submit rating',
      selectRating: 'Please select a rating'
    },
    zh: {
      rateEvent: '为此活动评分',
      rating: '您的评分',
      comment: '您的评论',
      commentPlaceholder: '告诉我们您对此活动的想法...',
      memory: '分享回忆',
      memoryPlaceholder: '分享此活动的特殊时刻...',
      photoUrl: '照片链接（可选）',
      photoPlaceholder: 'https://example.com/photo.jpg',
      submit: '提交评分和回忆',
      cancel: '取消',
      success: '感谢您的反馈！',
      error: '提交评分失败',
      selectRating: '请选择评分'
    },
    ms: {
      rateEvent: 'Nilai Acara Ini',
      rating: 'Penilaian Anda',
      comment: 'Komen Anda',
      commentPlaceholder: 'Beritahu kami pendapat anda tentang acara ini...',
      memory: 'Kongsi Kenangan',
      memoryPlaceholder: 'Kongsi detik istimewa dari acara ini...',
      photoUrl: 'URL Foto (pilihan)',
      photoPlaceholder: 'https://example.com/photo.jpg',
      submit: 'Hantar Penilaian & Kenangan',
      cancel: 'Batal',
      success: 'Terima kasih atas maklum balas anda!',
      error: 'Gagal menghantar penilaian',
      selectRating: 'Sila pilih penilaian'
    },
    ta: {
      rateEvent: 'இந்த நிகழ்வை மதிப்பிடுங்கள்',
      rating: 'உங்கள் மதிப்பீடு',
      comment: 'உங்கள் கருத்துகள்',
      commentPlaceholder: 'இந்த நிகழ்வைப் பற்றி நீங்கள் என்ன நினைக்கிறீர்கள் என்று எங்களிடம் கூறுங்கள்...',
      memory: 'நினைவைப் பகிர்ந்து கொள்ளுங்கள்',
      memoryPlaceholder: 'இந்த நிகழ்வின் சிறப்பான தருணத்தைப் பகிர்ந்து கொள்ளுங்கள்...',
      photoUrl: 'புகைப்பட URL (விருப்பம்)',
      photoPlaceholder: 'https://example.com/photo.jpg',
      submit: 'மதிப்பீடு மற்றும் நினைவை சமர்பிக்கவும்',
      cancel: 'ரத்து செய்',
      success: 'உங்கள் கருத்துக்கு நன்றி!',
      error: 'மதிப்பீடு சமர்பிக்க முடியவில்லை',
      selectRating: 'தயவுசெய்து மதிப்பீட்டைத் தேர்ந்தெடுக்கவும்'
    }
  };

  const t = translations[language] || translations.en;

  const submitRating = async () => {
    if (rating === 0) {
      toast.error(t.selectRating);
      return;
    }

    if (!profile) return;

    setSubmitting(true);

    try {
      // Submit rating
      const { error: ratingError } = await supabase
        .from('event_ratings')
        .insert({
          user_id: profile.id,
          activity_id: activityId,
          rating,
          comment: comment.trim() || null
        });

      if (ratingError) {
        throw ratingError;
      }

      // Submit memory if provided
      if (memoryText.trim() || photoUrl.trim()) {
        const { error: memoryError } = await supabase
          .from('event_memories')
          .insert({
            user_id: profile.id,
            activity_id: activityId,
            memory_text: memoryText.trim() || null,
            photo_url: photoUrl.trim() || null
          });

        if (memoryError) {
          console.error('Error saving memory:', memoryError);
        }
      }

      toast.success(t.success);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            {t.rateEvent}
          </CardTitle>
          <p className="text-sm text-gray-600">{activityTitle}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>{t.rating}</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star 
                    className={`h-6 w-6 ${
                      star <= rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">
              <MessageSquare className="h-4 w-4 inline mr-1" />
              {t.comment}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.commentPlaceholder}
              rows={3}
            />
          </div>

          {/* Memory */}
          <div className="space-y-2">
            <Label htmlFor="memory">
              <Camera className="h-4 w-4 inline mr-1" />
              {t.memory}
            </Label>
            <Textarea
              id="memory"
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              placeholder={t.memoryPlaceholder}
              rows={2}
            />
          </div>

          {/* Photo URL */}
          <div className="space-y-2">
            <Label htmlFor="photoUrl">{t.photoUrl}</Label>
            <Input
              id="photoUrl"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder={t.photoPlaceholder}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              onClick={submitRating}
              disabled={submitting || rating === 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              {submitting ? 'Submitting...' : t.submit}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRatingModal;
