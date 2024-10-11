package licenta.retrievedata.entitites;


import jakarta.persistence.*;


import java.util.List;

@Entity
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Long userId;

    @ManyToMany
    private List<Device> devices;


    public Solution(Long id, Long userId, List<Device> devices) {
        this.id = id;
        this.userId = userId;
        this.devices = devices;
    }

    public Solution() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Device> getDevices() {
        return devices;
    }

    public void setDevices(List<Device> devices) {
        this.devices = devices;
    }

}
