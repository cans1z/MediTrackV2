namespace MediTrack.API.Extensions;

public class ConflictException : Exception
{
    public ConflictException(string message) : base(message)  { }
}