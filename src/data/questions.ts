export type Dimension = "EI" | "SN" | "TF" | "JP" | "AT" | "CS";
export type PoleKey = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P" | "A" | "T_" | "C" | "S_";

export type Question = {
  id: number;
  text: string;
  dimension: Dimension;
  keyed: PoleKey;
  reverse: boolean;
};

export const ALL_QUESTIONS: Question[] = [
  // E vs I
  { id: 1,  text: "You feel energised after spending time in large social gatherings.", dimension: "EI", keyed: "E", reverse: false },
  { id: 2,  text: "You prefer to think through ideas quietly before sharing them with others.", dimension: "EI", keyed: "I", reverse: true },
  { id: 3,  text: "You regularly make new friends without much difficulty.", dimension: "EI", keyed: "E", reverse: false },
  { id: 4,  text: "You find that you need significant time alone to recharge after social events.", dimension: "EI", keyed: "I", reverse: true },
  { id: 5,  text: "You find it easy to introduce yourself to people you have never met.", dimension: "EI", keyed: "E", reverse: false },
  { id: 6,  text: "You prefer to have a small circle of close friends rather than a wide social network.", dimension: "EI", keyed: "I", reverse: true },
  { id: 7,  text: "After a long exhausting week, a social event with friends sounds genuinely appealing.", dimension: "EI", keyed: "E", reverse: false },
  { id: 8,  text: "You often feel drained rather than energised by extended time spent with large groups of people.", dimension: "EI", keyed: "I", reverse: true },
  { id: 9,  text: "You tend to be the person who initiates conversations rather than waiting for others to approach.", dimension: "EI", keyed: "E", reverse: false },
  { id: 10, text: "You often prefer a quiet evening at home over going out to a busy social event.", dimension: "EI", keyed: "I", reverse: true },
  // S vs N
  { id: 11, text: "You tend to focus more on facts and present realities than on future possibilities.", dimension: "SN", keyed: "S", reverse: false },
  { id: 12, text: "You enjoy exploring abstract ideas and theoretical concepts even when they have no practical application.", dimension: "SN", keyed: "N", reverse: true },
  { id: 13, text: "You prefer concrete, step-by-step instructions over a broad overview of goals.", dimension: "SN", keyed: "S", reverse: false },
  { id: 14, text: "You often find yourself connecting ideas from very different fields that others do not see as related.", dimension: "SN", keyed: "N", reverse: true },
  { id: 15, text: "You trust proven methods and established ways of doing things over untested approaches.", dimension: "SN", keyed: "S", reverse: false },
  { id: 16, text: "You are drawn more to what could be than to what currently is.", dimension: "SN", keyed: "N", reverse: true },
  { id: 17, text: "In a conversation you tend to focus more on the specific details than on the broader patterns.", dimension: "SN", keyed: "S", reverse: false },
  { id: 18, text: "You spend a lot of your free time exploring ideas and topics that simply interest you, without a practical goal.", dimension: "SN", keyed: "N", reverse: true },
  { id: 19, text: "You find it easier to remember specific facts and details than overall impressions or theories.", dimension: "SN", keyed: "S", reverse: false },
  { id: 20, text: "When reading or listening, you find yourself more interested in what is implied than in what is stated directly.", dimension: "SN", keyed: "N", reverse: true },
  // T vs F
  { id: 21, text: "When making a decision, you prioritise logical consistency over concern for how it will affect others.", dimension: "TF", keyed: "T", reverse: false },
  { id: 22, text: "Seeing other people in distress makes you feel a strong emotional pull to help, even strangers.", dimension: "TF", keyed: "F", reverse: true },
  { id: 23, text: "You think the world would work better if people relied more on rational analysis and less on feelings.", dimension: "TF", keyed: "T", reverse: false },
  { id: 24, text: "When a friend is upset, your first instinct is to listen and empathise rather than to solve the problem.", dimension: "TF", keyed: "F", reverse: true },
  { id: 25, text: "You find it more useful to be honest and direct with someone than to protect their feelings.", dimension: "TF", keyed: "T", reverse: false },
  { id: 26, text: "Harmony in your relationships matters deeply to you, sometimes more than getting your own way.", dimension: "TF", keyed: "F", reverse: true },
  { id: 27, text: "You are more persuaded by a well-constructed logical argument than by an emotionally compelling story.", dimension: "TF", keyed: "T", reverse: false },
  { id: 28, text: "Your happiness comes more from helping others succeed than from your own personal achievements.", dimension: "TF", keyed: "F", reverse: true },
  { id: 29, text: "You tend to be sceptical of decisions that prioritise feelings over facts.", dimension: "TF", keyed: "T", reverse: false },
  { id: 30, text: "When you disagree with someone, your first concern is how to resolve the disagreement without damaging the relationship.", dimension: "TF", keyed: "F", reverse: true },
  // J vs P
  { id: 31, text: "You like to have things decided and settled rather than leaving options open.", dimension: "JP", keyed: "J", reverse: false },
  { id: 32, text: "You usually prefer to be spontaneous rather than follow a detailed plan.", dimension: "JP", keyed: "P", reverse: true },
  { id: 33, text: "You often make a backup plan for your backup plan.", dimension: "JP", keyed: "J", reverse: false },
  { id: 34, text: "You find it energising rather than stressful to work on something without a clear plan.", dimension: "JP", keyed: "P", reverse: true },
  { id: 35, text: "You prefer to complete one task fully before beginning the next.", dimension: "JP", keyed: "J", reverse: false },
  { id: 36, text: "You tend to leave your options open for as long as possible before making a final decision.", dimension: "JP", keyed: "P", reverse: true },
  { id: 37, text: "You find comfort in having a clear schedule and knowing what is happening when.", dimension: "JP", keyed: "J", reverse: false },
  { id: 38, text: "You often end up doing things at the last possible moment rather than spreading the work out in advance.", dimension: "JP", keyed: "P", reverse: true },
  { id: 39, text: "You prefer to do your responsibilities before allowing yourself to relax.", dimension: "JP", keyed: "J", reverse: false },
  { id: 40, text: "You find highly structured routines somewhat constraining rather than reassuring.", dimension: "JP", keyed: "P", reverse: true },
  // A vs T
  { id: 41, text: "You usually stay calm even when under significant pressure.", dimension: "AT", keyed: "A", reverse: false },
  { id: 42, text: "Even a small mistake can cause you to doubt your overall abilities for a period of time.", dimension: "AT", keyed: "T_", reverse: true },
  { id: 43, text: "You rarely worry about whether you are making a good impression on people you meet.", dimension: "AT", keyed: "A", reverse: false },
  { id: 44, text: "You are prone to worrying that things will take a turn for the worse.", dimension: "AT", keyed: "T_", reverse: true },
  { id: 45, text: "You rarely second-guess decisions you have already made.", dimension: "AT", keyed: "A", reverse: false },
  { id: 46, text: "You often replay past conversations or events wondering if you should have handled them differently.", dimension: "AT", keyed: "T_", reverse: true },
  { id: 47, text: "You feel confident that you can handle most challenges life throws at you.", dimension: "AT", keyed: "A", reverse: false },
  { id: 48, text: "Your mood can change fairly quickly in response to how things are going around you.", dimension: "AT", keyed: "T_", reverse: true },
  { id: 49, text: "When you receive criticism, you are generally able to consider it and move on without it affecting you much.", dimension: "AT", keyed: "A", reverse: false },
  { id: 50, text: "You tend to hold yourself to high standards and feel genuine discomfort when you fall short of them.", dimension: "AT", keyed: "T_", reverse: true },
  // C vs S
  { id: 51, text: "You naturally adjust your approach based on what will work best for the group you are working with.", dimension: "CS", keyed: "C", reverse: false },
  { id: 52, text: "You prefer to set your own goals and standards rather than align with what the group expects.", dimension: "CS", keyed: "S_", reverse: true },
  { id: 53, text: "You find it genuinely satisfying when everyone in a group has had their say and reached agreement.", dimension: "CS", keyed: "C", reverse: false },
  { id: 54, text: "You work best when you have significant independence to decide how to approach a task.", dimension: "CS", keyed: "S_", reverse: true },
  { id: 55, text: "You tend to prioritise group harmony when making decisions that affect others.", dimension: "CS", keyed: "C", reverse: false },
  { id: 56, text: "You are primarily motivated by your own vision and internal sense of purpose rather than group expectations.", dimension: "CS", keyed: "S_", reverse: true },
  { id: 57, text: "You feel more satisfied by a team achievement than by a personal one of equivalent size.", dimension: "CS", keyed: "C", reverse: false },
  { id: 58, text: "You find it easier to work alone for extended periods than most people seem to.", dimension: "CS", keyed: "S_", reverse: true },
  { id: 59, text: "You genuinely enjoy the process of building consensus, even when it takes longer than just deciding.", dimension: "CS", keyed: "C", reverse: false },
  { id: 60, text: "You rarely feel the need to seek approval from others before acting on a decision you have made.", dimension: "CS", keyed: "S_", reverse: true },
];
