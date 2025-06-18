
-- Add tables for hobbies/interests, event ratings, memories, and friend referrals
CREATE TABLE public.user_hobbies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  hobby_name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.available_hobbies (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  icon text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.event_ratings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, activity_id)
);

CREATE TABLE public.event_memories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id uuid REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  memory_text text,
  photo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.friend_referrals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_phone text NOT NULL,
  referred_user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  bonus_points_awarded boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert some default hobbies
INSERT INTO public.available_hobbies (name, icon) VALUES
('Tai Chi', '🥋'),
('Bird Watching', '🐦'),
('Gardening', '🌱'),
('Mahjong', '🀄'),
('Chess', '♟️'),
('Cooking', '👨‍🍳'),
('Walking', '🚶'),
('Photography', '📸'),
('Reading', '📚'),
('Dancing', '💃'),
('Singing', '🎤'),
('Calligraphy', '✍️');

-- Add more activities with symbols and all required fields
INSERT INTO public.activities (
  title, title_chinese, title_malay, title_tamil,
  description, description_chinese, description_malay, description_tamil,
  location, location_chinese, location_malay, location_tamil,
  activity_date, activity_time, points_reward
) VALUES
('🎤 Community Karaoke Night', '🎤 社区卡拉OK之夜', '🎤 Malam Karaoke Komuniti', '🎤 சமுதாய கராஓகே இரவு', 
 'Join us for a fun evening of singing your favorite songs!', '加入我们，享受一个愉快的歌唱之夜！', 'Sertai kami untuk malam yang menyeronokkan dengan menyanyikan lagu kegemaran anda!', 'உங்கள் பிடித்த பாடல்களைப் பாடும் வேடிக்கையான மாலையில் எங்களுடன் சேருங்கள்!',
 'Keat Hong CC Auditorium', '吉丰民众俱乐部礼堂', 'Auditorium Kelab Komuniti Keat Hong', 'கீட் ஹாங் சமுதாய மன்ற அரங்கம்',
 '2025-06-25', '19:00', 30),

('♟️ Chess Tournament', '♟️ 象棋锦标赛', '♟️ Kejohanan Catur', '♟️ சதுரங்க போட்டி',
 'Test your strategic skills in our monthly chess competition.', '在我们的月度象棋比赛中测试您的战略技能。', 'Uji kemahiran strategik anda dalam pertandingan catur bulanan kami.', 'எங்கள் மாதாந்திர சதுரங்க போட்டியில் உங்கள் மூலோபாய திறன்களைச் சோதிக்கவும்.',
 'Community Hall', '社区大厅', 'Dewan Komuniti', 'சமுதாய மண்டபம்',
 '2025-06-28', '14:00', 25),

('🌱 Herb Garden Workshop', '🌱 香草园工作坊', '🌱 Bengkel Taman Herba', '🌱 மூலிகை தோட்ட பட்டறை',
 'Learn to grow your own herbs and spices at home.', '学习在家种植自己的香草和香料。', 'Belajar menanam herba dan rempah sendiri di rumah.', 'வீட்டில் உங்கள் சொந்த மூலிகைகள் மற்றும் மசாலாப் பொருட்களை வளர்க்க கற்றுக்கொள்ளுங்கள்.',
 'Rooftop Garden', '屋顶花园', 'Taman Bumbung', 'மேல்மாடி தோட்டம்',
 '2025-07-02', '10:00', 20),

('🀄 Mahjong Social', '🀄 麻将社交', '🀄 Sosial Mahjong', '🀄 மஹ்ஜாங் சமூக கூட்டம்',
 'Friendly mahjong games with tea and snacks provided.', '友好的麻将游戏，提供茶水和点心。', 'Permainan mahjong mesra dengan teh dan snek disediakan.', 'தேநீர் மற்றும் சிற்றுண்டிகளுடன் நட்பு மஹ்ஜாங் விளையாட்டுகள்.',
 'Multi-Purpose Room', '多用途厅', 'Bilik Serbaguna', 'பல்நோக்கு அறை',
 '2025-07-05', '15:00', 15),

('📸 Photography Walk', '📸 摄影漫步', '📸 Jalan Fotografi', '📸 புகைப்பட நடைப்பயிற்சி',
 'Explore the neighborhood while learning photography tips.', '在学习摄影技巧的同时探索社区。', 'Terokai kejiranan sambil belajar petua fotografi.', 'புகைப்பட உதவிக்குறிப்புகளைக் கற்றுக்கொள்ளும்போது அக்கம்பக்கத்தை ஆராயுங்கள்.',
 'Starting at Main Entrance', '从正门开始', 'Bermula di Pintu Masuk Utama', 'முக்கிய நுழைவாயிலில் தொடங்கும்',
 '2025-07-08', '08:00', 20),

('💃 Line Dancing Class', '💃 排舞课程', '💃 Kelas Tarian Baris', '💃 வரிசை நடன வகுப்பு',
 'Learn fun and easy line dances to keep active and social.', '学习有趣简单的排舞，保持活跃和社交。', 'Belajar tarian baris yang menyeronokkan dan mudah untuk kekal aktif dan sosial.', 'சுறுசுறுப்பாகவும் சமூகமாகவும் இருக்க வேடிக்கையான மற்றும் எளிதான வரிசை நடனங்களைக் கற்றுக்கொள்ளுங்கள்.',
 'Dance Studio', '舞蹈室', 'Studio Tarian', 'நடன ஸ்டுடியோ',
 '2025-07-12', '16:00', 25);

-- Enable RLS
ALTER TABLE public.user_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own hobbies" ON public.user_hobbies
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Available hobbies are visible to all" ON public.available_hobbies
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own ratings" ON public.event_ratings
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Event ratings are visible to all" ON public.event_ratings
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own memories" ON public.event_memories
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Event memories are visible to all" ON public.event_memories
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own referrals" ON public.friend_referrals
FOR ALL USING (auth.uid() = referrer_id);
