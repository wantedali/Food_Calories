using FoodCalorie.Models;

namespace FoodCalorie.Services;

public static class CalorieCalculator
{
    public static double CalculateBMR(User user)
    {
            double BMR;
        if (user.BodyFat == 0)
        {
            if (user.Gender == Gender.Male)
            {

                BMR = 10 * user.Weight + 6.25 * user.Height - 5 * user.Age + 5;
            }
            else
            {
                BMR = 10 * user.Weight + 6.25 * user.Height - 5 * user.Age - 161;

            }

            return user.BMR = BMR;
        }
        double lbm = user.Weight * (1 - user.BodyFat / 100);
        BMR = (lbm * 21.6) + 370;
        return user.BMR = BMR;
    }

    public static double CalculateTDEE(User user)
    {
        double BMR = CalculateBMR(user);
        return user.TDEE = BMR * user.ActivityLevel;
    }

    public static double finalCalorie(User user)
    {
        double tdee = CalculateTDEE(user);
        if (user.Goal == Goal.Gain)
        {
            switch (user.HowFast)
            {
                case HowFast.Slow:return tdee + 250;
                case HowFast.Moderate:return tdee + 500;
                case HowFast.Fast:return tdee + 1000; 
            }


        }
        else if (user.Goal == Goal.Lose)
        {
            switch (user.HowFast)
            {
                case HowFast.Slow: return tdee - 250;
                case HowFast.Moderate: return tdee - 500;
                case HowFast.Fast: return tdee - 1000;
            }
        }
        
            return tdee;
        
    }
}
